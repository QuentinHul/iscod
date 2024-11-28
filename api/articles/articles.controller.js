const NotFoundError = require("../../errors/not-found");
const ForbiddenError = require('../../errors/forbidden');
const articleService = require('./articles.service');
const UnauthorizedError = require("../../errors/unauthorized");

class ArticleController {
    async create(req, res, next) {
        try {
            const articleToCreate = {
                title: req.body.title,
                content: req.body.content,
                user: req.user._id // indiquer l'id de l'utilisateur connecté qui crée l'article
            }
            const article = await articleService.create(articleToCreate);

            req.io.emit("article:create", { article }); // Emettre un event temps réel

            res.status(201).json(article);

        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            // l'utilisateur doit être un admin pour mettre à jour un article
            if (req.user.role != "admin") {
                throw new ForbiddenError;
            }

            const articleModified = await articleService.update(req.params.id, req.body);
            req.io.emit("article:update", { articleModified }); // Emettre un event temps réel

            res.json(articleModified);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            // l'utilisateur doit être un admin pour supprimer un article
            if (req.user.role != "admin") {
                throw new ForbiddenError;
            }

            const id = req.params.id;
            await articleService.delete(id);

            req.io.emit("article:delete", { id }); // Emettre un event temps réel

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ArticleController();