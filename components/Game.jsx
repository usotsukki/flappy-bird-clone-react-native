import { useEffect, useState } from "react";
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	Pressable,
} from "react-native";
import RNRestart from "react-native-restart";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Bird from "./Bird";
import Obstacles from "./Obstacles";

export default function Game() {
	const screenWidth = Dimensions.get("window").width;
	const screenHeight = Dimensions.get("window").height;
	const birdLeft = screenWidth * 0.5;
	const [birdBottom, setBirdBottom] = useState(screenHeight * 0.5);
	const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth);
	const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(
		screenWidth * 1.5 + 30
	);
	const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0);
	const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);
	const [score, setScore] = useState(0);

	const gravity = 3;
	let obstacleWidth = 60;
	let obstacleHeight = 300;
	let gap = 200;

	let gameTimerId;
	let obstaclesTimerId;
	let obstaclesTimerIdTwo;

	//bird falling
	useEffect(() => {
		if (birdBottom > 0) {
			gameTimerId = setInterval(() => {
				setBirdBottom((birdBottom) => birdBottom - gravity);
			}, 30);

			return () => {
				clearInterval(gameTimerId);
			};
		}
	}, [birdBottom]);

	const jump = () => {
		if (!isGameOver && birdBottom < screenHeight) {
			setBirdBottom((birdBottom) => birdBottom + 50);
			console.log("jumped");
		}
	};

	//start first obstacle
	useEffect(() => {
		if (obstaclesLeft > -60) {
			obstaclesTimerId = setInterval(() => {
				setObstaclesLeft((obstaclesLeft) => obstaclesLeft - 5);
			}, 30);
			return () => {
				clearInterval(obstaclesTimerId);
			};
		} else {
			setScore((score) => score + 1);
			setObstaclesLeft(screenWidth);
			setObstaclesNegHeight(-Math.random() * 100);
		}
	}, [obstaclesLeft, isGameOver]);

	//start second obstacle
	useEffect(() => {
		if (obstaclesLeftTwo > -60) {
			obstaclesTimerIdTwo = setInterval(() => {
				setObstaclesLeftTwo((obstaclesLeftTwo) => obstaclesLeftTwo - 5);
			}, 30);
			return () => {
				clearInterval(obstaclesTimerIdTwo);
			};
		} else {
			setScore((score) => score + 1);
			setObstaclesLeftTwo(screenWidth);
			setObstaclesNegHeightTwo(-Math.random() * 100);
		}
	}, [obstaclesLeftTwo, isGameOver]);

	//check for collisions
	useEffect(() => {
		if (
			((birdBottom < obstaclesNegHeight + obstacleHeight + 30 ||
				birdBottom > obstaclesNegHeight + obstacleHeight + gap - 30) &&
				obstaclesLeft > screenWidth * 0.5 - 30 &&
				obstaclesLeft < screenWidth * 0.5 + 30) ||
			((birdBottom < obstaclesNegHeightTwo + obstacleHeight + 30 ||
				birdBottom > obstaclesNegHeightTwo + obstacleHeight + gap - 30) &&
				obstaclesLeftTwo > screenWidth * 0.5 - 30 &&
				obstaclesLeftTwo < screenWidth * 0.5 + 30)
		)
			gameOver();
	});

	const gameOver = () => {
		clearInterval(gameTimerId);
		clearInterval(obstaclesTimerId);
		clearInterval(obstaclesTimerIdTwo);
		setIsGameOver(true);
	};
	const restart = () => {
		setIsGameOver(false);
		setScore(0);
		setBirdBottom(screenHeight * 0.5);
		setObstaclesLeft(screenWidth);
		setObstaclesLeftTwo(screenWidth * 1.5 + 30);
	};

	return (
		<TouchableWithoutFeedback onPress={jump}>
			<View style={styles.container}>
				{isGameOver && (
					<View style={styles.gameOver}>
						<Pressable onPress={restart}>
							<MaterialCommunityIcons
								color={"white"}
								size={50}
								name={"restart"}
							/>
						</Pressable>
						<Text style={styles.text}>GameOver</Text>
						<Text style={styles.text}>Score: {score}</Text>
					</View>
				)}
				<Bird birdBottom={birdBottom} birdLeft={birdLeft} />
				<Obstacles
					color={"green"}
					obstacleWidth={obstacleWidth}
					obstacleHeight={obstacleHeight}
					randomBottom={obstaclesNegHeight}
					gap={gap}
					obstaclesLeft={obstaclesLeft}
				/>
				<Obstacles
					color={"yellow"}
					obstacleWidth={obstacleWidth}
					obstacleHeight={obstacleHeight}
					randomBottom={obstaclesNegHeightTwo}
					gap={gap}
					obstaclesLeft={obstaclesLeftTwo}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "midnightblue",
	},
	gameOver: {
		position: "absolute",
		zIndex: 999,
		height: "100%",
		width: "100%",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
	text: {
		color: "white",
		fontSize: "large",
	},
});
