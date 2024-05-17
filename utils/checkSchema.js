const {checkSchema} = require("express-validator");
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const firebaseUrlPattern = new RegExp(`^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/${FIREBASE_STORAGE_BUCKET}`);

const registrationSchema = () => {
  return checkSchema({
    username: {
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {min: 5, max: 13},
        errorMessage: "username must be at least 5 chars and max 13 chars",
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
        errorMessage: "the password must include at least one number",
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
        errorMessage: "the password must be at least 8 chars",
      },
      matches: {
        options: /[0-9]/,
        errorMessage: "the password must include at least one number",
      },
    },
  });
};

const biodataSchema = () => {
  return checkSchema({
    firstName: {
      optional: {options: {nullable: true}},
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {max: 20},
        errorMessage: "firstname max 20 chars",
      },
    },
    lastName: {
      optional: {options: {nullable: true}},
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {max: 10},
        errorMessage: "lastname max 10 chars",
      },
    },
    infoBio: {
      optional: {options: {nullable: true}},
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {max: 150},
        errorMessage: "info max 150 chars",
      },
    },
    address: {
      optional: {options: {nullable: true}},
      isString: {
        errorMessage: "must be string",
      },
      isLength: {
        options: {max: 43},
        errorMessage: "info max 43 chars",
      },
    },
    birthDate: {
      optional: {options: {nullable: true}},
      matches: {
        options: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        errorMessage: "must be in DD/MM/YYYY format",
      },
    },
    gender: {
      optional: {options: {nullable: true}},
      isIn: {
        options: [["Male", "Female", "Other"]],
        errorMessage: "must be one of Male, Female, Other",
      },
    },
    profilePicture: {
      optional: {options: {nullable: true}},
      isURL: {
        errorMessage: "must be a valid URL",
      },
      matches: {
        options: firebaseUrlPattern,
        errorMessage: "must be a valid Firebase storage link (we recommend to change photo only in our webApp https://rps-game-hazeem.vercel.app)",
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
        options: {min: 5, max: 10},
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
