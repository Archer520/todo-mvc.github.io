(function (window) {
    'use strict';
    // 声明对象存储所有用于进行事项类别筛选的函数
    let filters = {
        all: function (todos) {
            return todos;
        },
        active: function (todos) {
            return todos.filter(todo => !todo.completed);
        },
        completed: function (todos) {
            return todos.filter(todo => todo.completed);
        }
    }
    // 声明常量用于存储本地存储中保存事项的键
    const TODOS_KEY = 'todos-vue';
    // 声明对象统一保存本地存储的处理功能
    let todoStorage = {
        // 用于读取本地存储数据
        get: function () {
            return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
        },
        // 用于更新本地存储数据
        set: function (todos) {
            localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
        }
    }
    new Vue({
        el: '#app',
        data() {
            return {
                // todos 用于存储所有待办事项信息
                todos: todoStorage.get(),
                // 存储新增输入框的数据
                newTodo: '',
                // 存储正在编辑的 todo
                editingTodo: null,
                // 存储正在编辑的 todo 内容
                titleBeforeEdit: '',
                // 存储要显示的事项类别
                todoType: 'all'
            }
        },
        watch: {
            todos: {
                deep: true,
                handler: todoStorage.set
            }
        },
        computed: {
            // 用于进行事项筛选处理
            filterTodo: function () {
                return filters[this.todoType](this.todos);
            },
            // 利用计算属性来计算未完成事项
            active: function () {
                // 利用封装函数实现 方便后期修改
                return filters['active'](this.todos).length;
            },
            // 利用计算属性控制全选按钮，如果每一项待办事项都选中，就让全选按钮选中
            all: {
                get: function () {
                    return this.todos.every(item => item.completed);
                },
                set: function (value) {
                    // value 代表全部切换选框的状态
                    this.todos.forEach(item => {
                        item.completed = value;
                    })
                }
            },
            // 清除已完成按钮显示
            clearBtn: function () {
                return this.todos.some(item => item.completed);
            },
        },
        methods: {
            // 添加待办事项
            addTodo: function () {
                var title = this.newTodo.trim();
                // 判断输入框是否为空
                if (!title.length) {
                    // 没有内容也清空有可能用户输入的是空格
                    this.newTodo = '';
                    return
                }
                // 调用数组的 push 函数实现添加功能 
                var id = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 0;
                this.todos.push({
                    id,
                    title,
                    completed: false
                })
                // 添加完了以后清空输入框
                this.newTodo = '';
            },
            // 删除待办事项
            delTodo: function (id) {
                this.todos = this.todos.filter(item => item.id !== id);
            },
            // 删除已完成的待办事项
            clearCompleted: function () {
                this.todos = this.todos.filter(item => !item.completed);
            },
            // 用于触发编辑，保存相关信息
            editTodo: function (todo) {
                this.editingTodo = todo;
                this.titleBeforeEdit = todo.title;
            },
            // 用于取消编辑，还原状态与内容
            cancelEdit: function (todo) {
                this.editingTodo = null;
                todo.title = this.titleBeforeEdit;
            },
            // 用于保存编辑
            editDone: function (todo) {
                if (!this.editingTodo) return;
                this.editingTodo = null;
                todo.title = todo.title.trim();
                if (!todo.title.length) {
                    this.delTodo(todo.id);
                }
            },
        },
        directives: {
            // 用于设置正在编辑的事项输入框获取焦点
            'todo-focus': function (el, binding) {
                // console.log(binding.value);
                if (binding.value) {
                    el.focus();
                }
            }
        },
    })
})(window);
