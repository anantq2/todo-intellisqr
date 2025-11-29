import express from 'express';
import { z } from 'zod';
import { Todo } from '../models/Todo';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

// GET Todos 
router.get('/', protect, async (req: any, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

// CREATE Todo
router.post('/', protect, async (req: any, res, next) => {
  try {
    const { title } = todoSchema.parse(req.body);
    const todo = await Todo.create({
      user: req.user.id,
      title,
      isCompleted: false
    });
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

// UPDATE Todo
router.put('/:id', protect, async (req: any, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    if (todo.user?.toString() !== req.user.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    todo.title = req.body.title || todo.title;
    if (req.body.isCompleted !== undefined) {
      todo.isCompleted = req.body.isCompleted;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

// DELETE Todo
router.delete('/:id', protect, async (req: any, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    if (todo.user?.toString() !== req.user.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await todo.deleteOne();
    res.json({ message: 'Todo removed' });
  } catch (error) {
    next(error);
  }
});

export default router;