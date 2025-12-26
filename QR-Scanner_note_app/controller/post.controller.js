const db = require('../db')
class PostController{
    async createPost(req, res){
        const {title, description, content} = req.body
        const newPost = await db.query(`INSERT INTO post (title, description, content) values ($1, $2, $3) RETURNING *`, [title, description, content])

        //То что будет возвращаться на клиент
        res.json(newPost.rows[0])
    }
    async getPost(req, res){
        const posts = await db.query(`SELECT * FROM post`)

        //То что будет возвращаться на клиент
        res.json(posts.rows)
    }

    async updatePost(req, res){
        const {id, title, description, content} = req.body
        const post = await db.query(`UPDATE post set title = $1, description = $2, content = $3 WHERE id = $4 RETURNING *`, [title, description, content, id])

        //То что будет возвращаться на клиент
        res.json(post.rows[0])
    }

    async deletePost(req, res){
        //Тот id что в роуте post.routs.js
        const id = req.params.id
        const post = await db.query(`DELETE FROM post where id = $1 RETURNING *`, [id])

        //То что будет возвращаться на клиент
        res.json(post.rows[0])
    }

}

module.exports = new PostController()