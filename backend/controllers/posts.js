const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then((createdPost) => {
        res.status(201).json({
            message: 'Post Added Successfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
        //201 means Ok and Something created.
    }).catch(
        error => {
            res.status(500).json({
                message: "could not add Post!"
            })
        }
    );
};

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery.then((documents) => {
        fetchedPosts = documents;
        console.log(documents);
        return Post.count()
    }).then(count => {
        res.status(200).json({
            message: 'posts fetched successfully',
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(
        error => {
            res.status(500).json({
                message: "Couldn't fetch Posts!"
            })
        }
    );
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post Not Found!' });
        }
    }).catch(
        error => {
            res.status(500).json({
                message: "Couldn't fetch Post!"
            })
        }
    );
};

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = {
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    }

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
        console.log(result);
        // if (result.nModified > 0) {//Here If we Don't change any field like title,image,discription and update then result return nModified = 0 and getting error "not Authorized!" ,so we here used result.n > 0
        if (result.n > 0) {
            res.status(201).json({ message: 'Updated Successfully' });
        } else {
            res.status(401).json({ message: 'not Authorized!' });
        }
    }).catch(
        error => {
            res.status(500).json({
                message: "Could not update Post!"
            })
        }
    );
};

exports.deletePost = (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
        if (result.n > 0) {
            res.status(201).json({ message: 'Deletion Successfully' });
        } else {
            res.status(401).json({ message: 'not Authorized!' });
        }
    }).catch(
        error => {
            res.status(500).json({
                message: "Couldn't delete Post!"
            })
        }
    );
};