import { View, Text } from 'react-native'

export default function Bird ({ birdBottom, birdLeft }) {
  const birdWidth = 50
  const birdHeight = 60
  return (
    <View
      style={{
        position: 'absolute',
        width: birdWidth,
        height: birdHeight,
        backgroundColor: '#d31111',
        borderRadius: 30,
        left: birdLeft - birdWidth * 0.5,
        bottom: birdBottom - birdHeight * 0.5
      }}
    />
  )
}
