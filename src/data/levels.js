// Level configurations for the 3D Light Reflection Puzzle
// Each level defines the laser emitter, target receiver, mirrors, and obstacles

export const LEVELS = [
    // Level 1 - Simple straight path with one mirror
    {
        id: 1,
        name: "First Reflection",
        difficulty: "Easy",
        emitter: {
            position: [-6, 1.5, 0],
            direction: [1, 0, 0],
            color: '#ff0044'
        },
        receiver: {
            position: [0, 1.5, -6],
            size: 1
        },
        mirrors: [
            {
                position: [0, 1.5, 0],
                rotation: [0, 0, 0], // Player needs to rotate to solve
                size: [2, 2],
                movable: true
            }
        ],
        obstacles: []
    },

    // Level 2 - Two mirrors
    {
        id: 2,
        name: "Double Bounce",
        difficulty: "Easy",
        emitter: {
            position: [-6, 1.5, -4],
            direction: [1, 0, 0],
            color: '#00ff88'
        },
        receiver: {
            position: [6, 1.5, -4],
            size: 1
        },
        mirrors: [
            {
                position: [-2, 1.5, -4],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [-2, 1.5, 2],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [4, 1.5, 2],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            }
        ],
        obstacles: []
    },

    // Level 3 - Three mirrors with obstacles
    {
        id: 3,
        name: "Obstacle Course",
        difficulty: "Medium",
        emitter: {
            position: [-6, 1.5, 3],
            direction: [1, 0, 0],
            color: '#ff00aa'
        },
        receiver: {
            position: [6, 1.5, 3],
            size: 1
        },
        mirrors: [
            {
                position: [-3, 1.5, 3],
                rotation: [0, Math.PI / 6, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [-3, 1.5, -3],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [3, 1.5, -3],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            }
        ],
        obstacles: [
            { position: [0, 1, 0], size: [1, 3, 1] },
            { position: [2, 1, 1], size: [1, 3, 1] }
        ]
    },

    // Level 4 - Complex multi-bounce
    {
        id: 4,
        name: "Laser Maze",
        difficulty: "Medium",
        emitter: {
            position: [-6, 2, 0],
            direction: [1, 0, 0],
            color: '#00f0ff'
        },
        receiver: {
            position: [0, 2, 6],
            size: 1
        },
        mirrors: [
            {
                position: [-2, 2, 0],
                rotation: [0, Math.PI / 6, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [-2, 2, -4],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [4, 2, -4],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [4, 2, 3],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            }
        ],
        obstacles: [
            { position: [1, 1.5, -2], size: [1.5, 4, 1.5] }
        ]
    },

    // Level 5 - Height variation
    {
        id: 5,
        name: "Vertical Challenge",
        difficulty: "Hard",
        emitter: {
            position: [-6, 1, 0],
            direction: [1, 0, 0],
            color: '#ffaa00'
        },
        receiver: {
            position: [6, 4, 0],
            size: 1
        },
        mirrors: [
            {
                position: [-2, 1, 0],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [-2, 1, -4],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [2, 3, -4],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            },
            {
                position: [2, 4, 0],
                rotation: [0, 0, 0],
                size: [2, 2],
                movable: true
            }
        ],
        obstacles: []
    },

    // Level 6 - Precision required
    {
        id: 6,
        name: "Precision Strike",
        difficulty: "Hard",
        emitter: {
            position: [-7, 2, -5],
            direction: [1, 0, 0],
            color: '#aa00ff'
        },
        receiver: {
            position: [7, 2, 5],
            size: 0.8
        },
        mirrors: [
            {
                position: [-4, 2, -5],
                rotation: [0, Math.PI / 6, 0],
                size: [1.8, 1.8],
                movable: true
            },
            {
                position: [-4, 2, 0],
                rotation: [0, 0, 0],
                size: [1.8, 1.8],
                movable: true
            },
            {
                position: [0, 2, 0],
                rotation: [0, 0, 0],
                size: [1.8, 1.8],
                movable: true
            },
            {
                position: [0, 2, 5],
                rotation: [0, 0, 0],
                size: [1.8, 1.8],
                movable: true
            },
            {
                position: [5, 2, 5],
                rotation: [0, 0, 0],
                size: [1.8, 1.8],
                movable: true
            }
        ],
        obstacles: [
            { position: [-2, 1.5, -2], size: [1, 4, 1] },
            { position: [2, 1.5, 2], size: [1, 4, 1] }
        ]
    }
];
