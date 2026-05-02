const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks
router.get('/', authenticate, async (req, res) => {
  try {
    const whereClause = req.user.role === 'ADMIN' ? {} : { assigneeId: req.user.userId };
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a task
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, projectId, assigneeId, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task status
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body; // PENDING, IN_PROGRESS, COMPLETED
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
