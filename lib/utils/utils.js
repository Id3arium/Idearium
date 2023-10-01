import _ from "lodash"

export function getNodeCardDuration(nodeCard, wordsPerMinute = 30) {
    const minTime = 10;
    const averageWordCharCount = 5.1;
    const wordsPerSecond =  wordsPerMinute / 60
  
    if (!nodeCard) { return 0 }
  
    const title = nodeCard.title ?? '';
    const content = nodeCard.content ?? '';

    const wordCount = title.split(' ').length + content.split(' ').length;
    const nonSpaceCharCount = (title + content).replace(/\s+/g, '').length;
    const charsPerWord = nonSpaceCharCount / wordCount;
    
    const readingTimeScaler = charsPerWord / averageWordCharCount;
    const readingTimeInSeconds = (readingTimeScaler * wordCount) / wordsPerSecond;
    
    return _.round(Math.max(readingTimeInSeconds, minTime), 2);
}
  
  