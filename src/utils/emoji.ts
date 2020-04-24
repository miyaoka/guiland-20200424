const codePoints: Record<string, [number, number][]> = {
  face: [
    [0x1f600, 69],
    [129296, 8],
    [129312, 16],
    [129332, 3],
    [129392, 1],
    [129395, 4],
    [129402, 1],
    [129464, 2],
    [129488, 7],
  ],
  hand: [
    [128070, 11],
    [128400, 1],
    [128405, 2],
    [129304, 8],
  ],
}

const faceList = codePoints.face
  .map(([first, length]) => {
    return [...new Array(length)].map((_, i) => first + i)
  })
  .flat()

export const getRandomFaceCode = () => {
  return faceList[Math.floor(faceList.length * Math.random())]
}
