// src/Constants/defaultPresets.jsx
import { v4 as uuidv4 } from 'uuid';





export const defaultPresets = [ 
	{
		id: uuidv4(),
		title: 'Linear',
		bezierValue: {
			cp1: { X: 0, Y: 0 },
			cp2: { X: 1, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Ease',
		bezierValue: {
			cp1: { X: 0.25, Y: 0.1 },
			cp2: { X: 0.25, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Ease-In',
		bezierValue: {
			cp1: { X: 0.42, Y: 0 },
			cp2: { X: 1, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Ease-Out',
		bezierValue: {
			cp1: { X: 0, Y: 0 },
			cp2: { X: 0.58, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Ease-In-Out',
		bezierValue: {
			cp1: { X: 0.42, Y: 0 },
			cp2: { X: 0.58, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Elastic-In',
		bezierValue: {
			cp1: { X: 0.5, Y: -0.5 },
			cp2: { X: 1, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Elastic-Out',
		bezierValue: {
			cp1: { X: 0, Y: 0 },
			cp2: { X: 0.5, Y: 1.5 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Elastic-In-Out',
		bezierValue: {
			cp1: { X: 0.5, Y: -0.5 },
			cp2: { X: 0.5, Y: 1.5 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Anticipate',
		bezierValue: {
			cp1: { X: 1, Y: 0 },
			cp2: { X: 0, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Overshoot',
		bezierValue: {
			cp1: { X: 0, Y: 1 },
			cp2: { X: 0, Y: 1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Glitch',
		bezierValue: {
			cp1: { X: 1, Y: 2 },
			cp2: { X: 0, Y: -1 },
		},
		isFavorite: false,
		isLocked: true,
	},
	{
		id: uuidv4(),
		title: 'Bounce',
		bezierValue: {
			cp1: { X: 0.5, Y: 2.2 },
			cp2: { X: 0, Y: 0 },
		},
		isFavorite: false,
		isLocked: true,
	},
];