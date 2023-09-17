import _ from "lodash"

export function getNodeCardDuration(nodeCard, wordsPerMinute = 60){
    let minTime = 10
    if (nodeCard == null) { return 0 }
    const wordCount = nodeCard?.title.split(' ').length + nodeCard?.content.split(' ').length
    const nonSpaceCharCount = nodeCard?.title.length + nodeCard?.content.length - (wordCount - 1)
    const wordCharCount = nonSpaceCharCount / wordCount

    const averageWordCharCount = 5.1
    let readingTimeScaler = wordCharCount / averageWordCharCount
    const readingSpeedInMinutes = readingTimeScaler * wordCount * wordsPerMinute
    const readingSpeedInSeconds = readingSpeedInMinutes / 60
    // console.log("getCurrentNodeCardDuration readingSpeedInSeconds", readingSpeedInSeconds )
    return _.round(Math.max(readingSpeedInSeconds, minTime), 2)
}