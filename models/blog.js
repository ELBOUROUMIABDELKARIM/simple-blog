const mongoose = require("mongoose");
const { Schema } = mongoose;

let titleLengthChecker = (title) => {
    if (!title) {
        return false;
    } else {
        if (title.length < 5 || title.length > 50) {
            return false;
        } else {
            return true;
        }
    }
};

let alphaNumericTitleChecker = (title) => {
    if (!title) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
};

let bodyLengthChecker = (body) => {
    if (!body) {
        return false;
    } else {
        if (body.length < 5 || body.length > 500) {
            return false;
        } else {
            return true;
        }
    }
};

let commentLengthChecker = (comment) => {
    if (!comment[0]) {
        return false;
    } else {
        if (comment[0].length < 1 || comment[0].length > 200) {
            return false;
        } else {
            return true;
        }
    }
};

const titleValidators = [{
        validator: titleLengthChecker,
        message: "Title must be at least 5 characters but no more than 50",
    },
    {
        validator: alphaNumericTitleChecker,
        message: "Title must be alphanumeric",
    },
];

const bodyValidators = [{
    validator: bodyLengthChecker,
    message: "Body must be at least characters but no more than 500",
}];

const commentValidators = [{
    validator: commentLengthChecker,
    message: "Comment must be at least 1 characters but no more than 200",
}];

const blogSchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    body: { type: String, required: true, validate: bodyValidators },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    comments: [{
        comment: { type: String, validate: commentValidators },
        commentator: { type: String },
    }],
});

module.exports = mongoose.model("Blog", blogSchema);