// Roblox Quiz Data - 10 Quizzes with 5 Questions Each

export interface Question {
    q: string;
    options: string[];
    correct: number;
}

export interface Quiz {
    id: number;
    title: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questions: Question[];
    reward: number;
}

export const QUIZZES: Quiz[] = [
    {
        id: 1,
        title: "Roblox Basics",
        category: "General",
        difficulty: "Easy",
        reward: 50,
        questions: [
            {
                q: "Who are the creators of Roblox?",
                options: ["David Baszucki & Erik Cassel", "Mark Zuckerberg", "Elon Musk", "Bill Gates"],
                correct: 0
            },
            {
                q: "What is the currency in Roblox?",
                options: ["Coins", "Robux", "Tix", "Dollars"],
                correct: 1
            },
            {
                q: "When was Roblox officially released?",
                options: ["2004", "2006", "2010", "2008"],
                correct: 1
            },
            {
                q: "What is Roblox Studio used for?",
                options: ["Playing games", "Creating games", "Chatting", "Trading"],
                correct: 1
            },
            {
                q: "What was Roblox originally called?",
                options: ["Dynablocks", "Blockland", "Buildbox", "Robloxia"],
                correct: 0
            }
        ]
    },
    {
        id: 2,
        title: "Popular Games",
        category: "Games",
        difficulty: "Easy",
        reward: 50,
        questions: [
            {
                q: "Which game is known for its obby courses?",
                options: ["Adopt Me", "Tower of Hell", "Brookhaven", "Bloxburg"],
                correct: 1
            },
            {
                q: "What type of game is Adopt Me?",
                options: ["Racing", "Pet simulation", "FPS", "Horror"],
                correct: 1
            },
            {
                q: "Which game lets you roleplay in a city?",
                options: ["Jailbreak", "Brookhaven", "Phantom Forces", "Arsenal"],
                correct: 1
            },
            {
                q: "What is the main objective in Jailbreak?",
                options: ["Build houses", "Escape prison or catch criminals", "Adopt pets", "Race cars"],
                correct: 1
            },
            {
                q: "Which game is a first-person shooter?",
                options: ["MeepCity", "Arsenal", "Royale High", "Adopt Me"],
                correct: 1
            }
        ]
    },
    {
        id: 3,
        title: "Roblox Features",
        category: "Features",
        difficulty: "Medium",
        reward: 75,
        questions: [
            {
                q: "What is the Roblox Premium membership formerly called?",
                options: ["Roblox Plus", "Builders Club", "Roblox Pro", "Elite Club"],
                correct: 1
            },
            {
                q: "What can you buy with Robux?",
                options: ["Only avatar items", "Only game passes", "Avatar items, game passes, and more", "Nothing"],
                correct: 2
            },
            {
                q: "What is the maximum number of friends you can have?",
                options: ["100", "200", "500", "Unlimited"],
                correct: 1
            },
            {
                q: "What does the 'Verified' badge mean?",
                options: ["Rich player", "Famous developer", "Authentic account", "Premium member"],
                correct: 2
            },
            {
                q: "What is the catalog used for?",
                options: ["Finding games", "Buying avatar items", "Chatting", "Trading"],
                correct: 1
            }
        ]
    },
    {
        id: 4,
        title: "Game Development",
        category: "Development",
        difficulty: "Medium",
        reward: 75,
        questions: [
            {
                q: "What programming language does Roblox use?",
                options: ["Python", "JavaScript", "Lua", "C++"],
                correct: 2
            },
            {
                q: "What is a 'Part' in Roblox Studio?",
                options: ["A script", "A basic building block", "A player", "A game"],
                correct: 1
            },
            {
                q: "What are 'Scripts' used for in Roblox?",
                options: ["Decoration", "Adding game logic", "Building", "Chatting"],
                correct: 1
            },
            {
                q: "What is the Workspace in Roblox Studio?",
                options: ["Where you code", "Where 3D objects exist", "Player inventory", "Settings menu"],
                correct: 1
            },
            {
                q: "What are 'Models' in Roblox?",
                options: ["Players", "Groups of parts", "Scripts", "Sounds"],
                correct: 1
            }
        ]
    },
    {
        id: 5,
        title: "Roblox History",
        category: "History",
        difficulty: "Hard",
        reward: 100,
        questions: [
            {
                q: "What year did Roblox development begin?",
                options: ["2001", "2003", "2004", "2006"],
                correct: 2
            },
            {
                q: "What was the first currency before Robux?",
                options: ["Coins", "Tix (Tickets)", "Bux", "Credits"],
                correct: 1
            },
            {
                q: "When were Tix removed from Roblox?",
                options: ["2014", "2016", "2017", "2018"],
                correct: 1
            },
            {
                q: "What was the original Roblox logo color?",
                options: ["Red", "Blue", "Green", "Yellow"],
                correct: 0
            },
            {
                q: "When did Roblox go public on NYSE?",
                options: ["2019", "2020", "2021", "2022"],
                correct: 2
            }
        ]
    },
    {
        id: 6,
        title: "Avatar & Customization",
        category: "Avatar",
        difficulty: "Easy",
        reward: 50,
        questions: [
            {
                q: "What are avatar items called in Roblox?",
                options: ["Skins", "Accessories", "Cosmetics", "All of the above"],
                correct: 3
            },
            {
                q: "What is a 'Limited' item?",
                options: ["Free item", "Rare tradeable item", "Common item", "Developer item"],
                correct: 1
            },
            {
                q: "What body type was added in 2016?",
                options: ["R6", "R15", "R20", "R10"],
                correct: 1
            },
            {
                q: "What are 'Faces' in Roblox?",
                options: ["Emotes", "Avatar facial expressions", "Game modes", "Chat features"],
                correct: 1
            },
            {
                q: "Can you customize your avatar for free?",
                options: ["Yes, with free items", "No, everything costs Robux", "Only with Premium", "Only on PC"],
                correct: 0
            }
        ]
    },
    {
        id: 7,
        title: "Trading & Economy",
        category: "Economy",
        difficulty: "Medium",
        reward: 75,
        questions: [
            {
                q: "What do you need to trade Limited items?",
                options: ["Nothing", "Roblox Premium", "1000 Robux", "Developer status"],
                correct: 1
            },
            {
                q: "What is RAP in trading?",
                options: ["Roblox Avatar Points", "Recent Average Price", "Rare Asset Price", "Robux After Purchase"],
                correct: 1
            },
            {
                q: "Can you trade Robux directly?",
                options: ["Yes", "No", "Only with Premium", "Only in groups"],
                correct: 1
            },
            {
                q: "What makes an item 'Limited U'?",
                options: ["Unlimited stock", "Limited quantity", "Ultra rare", "User-created"],
                correct: 1
            },
            {
                q: "What is the trading fee percentage?",
                options: ["5%", "10%", "30%", "No fee"],
                correct: 2
            }
        ]
    },
    {
        id: 8,
        title: "Game Mechanics",
        category: "Gameplay",
        difficulty: "Medium",
        reward: 75,
        questions: [
            {
                q: "What is an 'Obby'?",
                options: ["Obstacle course", "Pet", "Currency", "Avatar"],
                correct: 0
            },
            {
                q: "What does 'AFK' mean?",
                options: ["A Fun Kid", "Away From Keyboard", "All For Kids", "Always Finding Keys"],
                correct: 1
            },
            {
                q: "What is a 'Game Pass'?",
                options: ["Free entry", "Special perk you can buy", "Achievement", "Level"],
                correct: 1
            },
            {
                q: "What are 'Developer Products'?",
                options: ["One-time purchases", "Consumable purchases", "Free items", "Subscriptions"],
                correct: 1
            },
            {
                q: "What is 'Grinding' in Roblox games?",
                options: ["Dancing", "Repetitive tasks for rewards", "Building", "Trading"],
                correct: 1
            }
        ]
    },
    {
        id: 9,
        title: "Community & Social",
        category: "Community",
        difficulty: "Easy",
        reward: 50,
        questions: [
            {
                q: "What is a 'Group' in Roblox?",
                options: ["Chat room", "Community of players", "Game mode", "Avatar style"],
                correct: 1
            },
            {
                q: "Can you create your own group?",
                options: ["Yes, for 100 Robux", "Yes, for free", "No", "Only with Premium"],
                correct: 0
            },
            {
                q: "What is the maximum group size?",
                options: ["100 members", "1,000 members", "Unlimited", "10,000 members"],
                correct: 2
            },
            {
                q: "What are 'Badges' in games?",
                options: ["Currency", "Achievements", "Items", "Levels"],
                correct: 1
            },
            {
                q: "Can you voice chat in Roblox?",
                options: ["No", "Yes, if verified and 13+", "Yes, everyone", "Only in some games"],
                correct: 1
            }
        ]
    },
    {
        id: 10,
        title: "Advanced Knowledge",
        category: "Expert",
        difficulty: "Hard",
        reward: 100,
        questions: [
            {
                q: "What is the Roblox Developer Exchange (DevEx)?",
                options: ["Trading platform", "Converting Robux to real money", "Game marketplace", "Avatar shop"],
                correct: 1
            },
            {
                q: "What is the minimum Robux needed for DevEx?",
                options: ["10,000", "30,000", "50,000", "100,000"],
                correct: 3
            },
            {
                q: "What is 'FilteringEnabled'?",
                options: ["Chat filter", "Security feature", "Graphics setting", "Audio filter"],
                correct: 1
            },
            {
                q: "What is a 'RemoteEvent' used for?",
                options: ["Decoration", "Client-server communication", "Sound effects", "Animations"],
                correct: 1
            },
            {
                q: "What does 'FE' stand for in Roblox development?",
                options: ["Fast Engine", "Filtering Enabled", "Front End", "Full Experience"],
                correct: 1
            }
        ]
    }
];

// Helper function to get a random quiz
export function getRandomQuiz(): Quiz {
    const randomIndex = Math.floor(Math.random() * QUIZZES.length);
    return QUIZZES[randomIndex];
}

// Helper function to get quiz by difficulty
export function getQuizzesByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Quiz[] {
    return QUIZZES.filter(quiz => quiz.difficulty === difficulty);
}
