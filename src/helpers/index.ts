import { Pattern } from "../types/cardsName"

export function getSpriteName(pattern: number, points: number)
{
    let patternName = ""
    let pointsName = ""

    switch (pattern) {
        case 0: {
            patternName = Pattern.Diamond
            break
        }
        case 1: {
            patternName = Pattern.Heart
            break
        }
        case 2: {
            patternName = Pattern.Club
            break
        }
        case 3: {
            patternName = Pattern.Spade
            break
        }
        default: {
            patternName = ""
            break
        }
    }

    switch (points) {
        case 1: {
            pointsName = "Ace"
            break
        }
        case undefined: {
            pointsName = ""
            break
        }
        default: {
            pointsName = points.toString(10)
            break
        }
    }

    return patternName + pointsName
}