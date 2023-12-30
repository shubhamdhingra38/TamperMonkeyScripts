// ==UserScript==
// @name         LinkedIn Jobs Keywords Highlighter
// @namespace    http://tampermonkey.net/
// @version      2023-12-29
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_addStyle
// ==/UserScript==

;(function () {
  "use strict"

  // Keywords to highlight
  const RED_KEYWORDS = ["vue", "php", "ruby", "node", "devops"]

  const GREEN_KEYWORDS = [
    "javascript",
    "java",
    "python",
    "django",
    "spring",
    "aws",
    "cloud",
    "backend",
    "react",
    "frontend",
    "typescript",
    "dynamo",
    "s3",
    "lambda",
    "cdk",
    "docker",
    "backend",
    "fronntend",
  ]
  const NUMBER_REGEX = /\b\d+(?:\.\d+)?\b/g

  // Styles
  GM_addStyle(
    ".highlight-red { color: red !important; text-shadow: 0 0 2px red, 0 0 20px red; }"
  )
  GM_addStyle(
    ".highlight-green { color: greenyellow !important; text-shadow: 0 0 2px green, 0 0 20px green; }"
  )

  const nodeToObserve = document.getElementsByClassName(
    "jobs-search__job-details"
  )[0]

  const observer = new MutationObserver(check)
  observer.observe(nodeToObserve, { childList: true, subtree: true })

  console.log("Observing for changes...")

  let lastTextValue = ""
  const highlightedParagraphs = new Set()

  function check() {
    const jobDescriptionNode = document.getElementsByClassName(
      "jobs-description__container"
    )[0]

    const newTextValue = jobDescriptionNode.innerHTML
    if (newTextValue === lastTextValue) {
      console.log("Nothing changed")
      return
    }

    console.log("Document was changed")

    lastTextValue = newTextValue

    const paragraphs = jobDescriptionNode.querySelectorAll("p, li")

    paragraphs.forEach((paragraph) => {
      if (highlightedParagraphs.has(paragraph)) {
        return
      }
      highlightedParagraphs.add(paragraph)

      // Check numbers
      paragraph.innerHTML = paragraph.innerHTML.replace(
        NUMBER_REGEX,
        '<span class="highlight">$&</span>'
      )

      // Check keywords
      for (let keyword of GREEN_KEYWORDS.concat(RED_KEYWORDS)) {
        const innerHTML = paragraph.innerHTML
        const lowercaseKeyword = keyword.toLowerCase()
        const indexOfKeywordInText = innerHTML
          .toLowerCase()
          .indexOf(lowercaseKeyword)
        if (indexOfKeywordInText == -1) continue
        const startIndex = indexOfKeywordInText
        const endIndex = indexOfKeywordInText + lowercaseKeyword.length
        let modifiedKeywordHTML
        if (RED_KEYWORDS.includes(keyword)) {
          modifiedKeywordHTML = `<span class="highlight-red">${innerHTML.substring(
            startIndex,
            endIndex
          )}</span>`
        } else {
          modifiedKeywordHTML = `<span class="highlight-green">${innerHTML.substring(
            startIndex,
            endIndex
          )}</span>`
        }
        const modifiedInnerHTML =
          innerHTML.substring(0, startIndex) +
          modifiedKeywordHTML +
          innerHTML.substring(endIndex)
        paragraph.innerHTML = modifiedInnerHTML
      }
    })
  }
})()
