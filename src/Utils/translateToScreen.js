const translateToScreen = (xCord,yCord) => {
 return {x: xCord * 80 + 60, y: yCord * 80 + 165}
}

export default translateToScreen;