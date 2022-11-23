module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest'
    },
    "testPathIgnorePatterns": [
        "dist"
    ]
    /*globals: {
        "ts-jest": {
            isolatedModules: true,
        },
    },*/
};

