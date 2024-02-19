const {checkSchema} = require("express-validator");

const registrationSchema = () => {
  return checkSchema({
    username: {
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {min: 5, max: 15},
        errorMessage: "username must be at least 5 chars and max 15 chars",
      },
      custom: {
        options: (value) => {
          // Check if the username contains only letters, numbers, dot '.', and underscore '_'
          if (!/^[a-zA-Z0-9._]+$/.test(value)) {
            throw new Error("Username can only contain letters, numbers, dot '.' and underscore '_'");
          }
          // Check if the username contains at most one dot '.' and one underscore '_'
          const dotCount = (value.match(/\./g) || []).length;
          const underscoreCount = (value.match(/_/g) || []).length;
          if (dotCount > 1 || underscoreCount > 1) {
            throw new Error("Username can contain at most one dot '.' and one underscore '_'");
          }
          return true;
        },
      },
    },
    email: {
      isEmail: {
        errorMessage: "format email is invalid",
      },
    },
    password: {
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {min: 8},
        errorMessage: "the password must be at least 8 chars",
      },
      matches: {
        options: /[0-9]/,
        errorMessage: "the password must containt a numbers",
      },
    },
  });
};

const loginSchema = () => {
  return checkSchema({
    email: {
      isEmail: {
        errorMessage: "format email is invalid",
      },
    },
    password: {
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {min: 8},
        errorMessage: "the password must be at least 8 chars and containt a numbers",
      },
    },
  });
};

const biodataSchema = () => {
  return checkSchema({
    firstName: {
      isString: {
        errorMessage: "must be string",
      },
      matches: {
        options: /^[a-zA-Z]+$/,
        errorMessage: "must be letters without spaces",
      },
    },
    lastName: {
      isString: {
        errorMessage: "must be string",
      },
      matches: {
        options: /^[a-zA-Z]+$/,
        errorMessage: "must be letters without spaces",
      },
    },
    infoBio: {
      isString: {
        errorMessage: "must be string",
      },
    },
    address: {
      isString: {
        errorMessage: "must be string",
      },
    },
    birthDate: {
      matches: {
        options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        errorMessage: "must be in DD/MM/YYYY format",
      },
    },
    gender: {
      isIn: {
        options: [["male", "female", "other"]],
        errorMessage: "must be one of male, female, other",
      },
    },
  });
};

const newRoomSchema = () => {
  return checkSchema({
    roomName: {
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {min: 4, max: 10},
        errorMessage: "room name must be at least 5 chars and max 10 chars",
      },
    },
    player1Choice: {
      isIn: {
        options: [["rock", "paper", "scissors"]],
        errorMessage: "your choice must be one of rock, paper, scissors",
      },
    },
  });
};

const updateRoomSchema = () => {
  return checkSchema({
    player2Choice: {
      isIn: {
        options: [["rock", "paper", "scissors"]],
        errorMessage: "your choice must be one of rock, paper, scissors",
      },
    },
  });
};

module.exports = {
  registrationSchema,
  loginSchema,
  biodataSchema,
  newRoomSchema,
  updateRoomSchema,
};
