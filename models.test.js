const {Task,User,Board,sequelize} = require('./models')

describe('database CRUD operations',()=>{
    beforeAll(async ()=>{
        await sequelize.sync()
    })
    describe('create',()=>{
        test('creating task',async ()=>{
            const task = await Task.create({taskName: 'create task',taskDescription: 'create a test task in the database', priority: 'high', deadline: Date.now()})
            expect(task.id).toBeTruthy()
        })
        test('creating User',async ()=>{
            const user = await User.create({username: 'zanryll'})
            expect(user.id).toBeTruthy()
        })
        test('creating Board',async()=>{
            const board = await Board.create({name: 'exciting project'})
            expect(board.id).toBeTruthy()
        })

    })
    describe('create relationships and read',()=>{
        test('task belongs to board', async ()=>{
            const board = await Board.findByPk(1)
            const task = await Task.findByPk(1)
            await board.addTask(task)
            const tasks = await board.getTasks()
            expect(tasks.length).toBe(1)
        })
        test('board belongs to user,user has boards', async ()=>{
            const board = await Board.findByPk(1)
            const user = await User.findByPk(1)
            await user.addBoard(board)
            const boards = await user.getBoards()
            expect(boards.length).toBe(1)
            const gottenBoard = await Board.findByPk(1)
            const users = await gottenBoard.getUsers()
            expect(users.length).toBe(1)
        })
        test('task belongs to user,user has tasks', async ()=>{
            const task = await Task.findByPk(1)
            const user = await User.findByPk(1)
            await user.addTask(task)
            const tasks = await user.getTasks()
            expect(tasks.length).toBe(1)
            const gottenTask =await Task.findByPk(1)
            const asignee = await gottenTask.getUser()
            expect(asignee.username).toBeTruthy()
        })
    })
    describe('Update things in db',()=>{
        test('update task name', async ()=>{
            const task = await Task.findByPk(1)
            await task.update({taskName:'change task name'})
            expect(task.taskName).toBe('change task name')
        })
        test('update board name', async ()=>{
            const board = await Board.findByPk(1)
            await board.update({name:'changed board name'})
            expect(board.name).toBe('changed board name')
        })
        test('update username', async ()=>{
            const user = await User.findByPk(1)
            await user.update({username:'zan96'})
            expect(user.username).toBe('zan96')
        })

    })
    describe('destroy things in database',()=>{
        test('destroy user', async ()=>{
            await Task.findByPk(1).then(task =>{
                task.destroy()
            })
            expect(await Task.findByPk(1)).toBeFalsy()
        })
        test('destroy board', async ()=>{
            await Board.findByPk(1).then(board =>{
                board.destroy()
            })
            expect(await Board.findByPk(1)).toBeFalsy()
        })
        test('destroy user', async ()=>{
            await User.findByPk(1).then(user =>{
                user.destroy()
            })
            expect(await User.findByPk(1)).toBeFalsy()
        })
    })
})
