import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { v4 as uuidV4 } from 'uuid';

enum ExpenseCategory {
    FOOD = "FOOD", 
    TRAVEL = "TRAVEL", 
    EQUIPMENT = "EQUIPMENT"
}

class Expense {

    constructor(
        private category: ExpenseCategory, 
        private description: string, 
        private cost: number, 
        public id?: string | null
    ){

        if(id) {
            this.id = id;
        }else {
            this.id = uuidV4();
        }

    }

    public getCategory(): ExpenseCategory {
        return this.category;
    }

    public getDescription(): string {
        return this.description;
    }

    public getCost(): number {
        return this.cost
    }

    public editCategory(newCategory: ExpenseCategory): void {
        this.category = newCategory;
    }

    public editDescription(newDescription: string): void {
        this.description = newDescription;
    }

    public editCost(newCost: number): void {
        this.cost = newCost;
    }


}

class User { 

    public expenses: Expense[] = [];
    public expenseTotal: number = 0;
    public id: string = uuidV4();

    constructor(
        private firstName: string, 
        private lastName: string, 
        expenses?: Expense[], 
        expenseTotal?: number,
        id?: string
    ){

        if(id){
            this.id = id;
        }

        if(expenses){
            this.expenses = expenses;
        }

        if(expenseTotal){
            this.expenseTotal = expenseTotal;
        }

    }

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getExpenses(): Expense[] {
        return this.expenses;
    }

    public getExpenseTotal(): number {
        return this.expenseTotal;
    }

    public addExpense(expense: Expense): void {
        this.expenses = [...this.expenses, expense];
        this.updateExpenseTotal();
    }

    public setExpenses(expenses: Expense[]):void {
        this.expenses = expenses;
        this.updateExpenseTotal();
    }

    public removeExpense(id: string): void{
        const expenseItemIndex = this.expenses.findIndex(item => item.id === id);
        this.expenses.splice(expenseItemIndex,1);
        this.updateExpenseTotal()
    }

    public updateExpenseTotal(): void {
        let total = 0;

        this.expenses.forEach(item => {
            total += item.getCost()
        })

        this.expenseTotal = total;
    }

    public setFirstName(firstName: string): void {
        this.firstName = firstName;
    } 

    public setLastName(lastName: string): void {
        this.lastName = lastName;
    }

}

export const useStore = defineStore('useStore', () => {

    let users = reactive<User[]>([]);

    const addUser = (firstName: string, lastName: string): void => {
        console.log('add user', firstName, lastName);
        const user = new User(firstName, lastName);
        users.push(user);
        peristToLocalStorage();
    }

    const deleteUser = (id: string): void => {
        const userIdx = users.findIndex(user => user.id === id);
        users.splice(userIdx,1);
        peristToLocalStorage();
    }

    const getUserById = (id: string): any => {
        return users.find(user => user.id === id)
    }

    const editUser = (userId: string, firstName: string, lastName: string) => {
        const userIdx = users.findIndex(user => user.id === userId);
        users[userIdx].setFirstName(firstName);
        users[userIdx].setLastName(lastName);
        peristToLocalStorage();
    }

    const fetchAllExpenses = () => {

        let expensesCollection = users.map(user => {

            const userExpObjs = user.getExpenses();
            let coll;

            if(userExpObjs.length){

                coll = userExpObjs.map(expense => {
                    return {
                        userId: user.id,
                        expenseId: expense.id,
                        fullName: user.getFullName(),
                        category: expense.getCategory(), 
                        description: expense.getDescription(), 
                        cost: expense.getCost()
                    }
                });


            }else {
                coll = [];
            }
        

            return coll;

        });

        const expensesCollectionFlat = expensesCollection.flat();

        return expensesCollectionFlat;

    }

    const addExpense = (userId: string, category: ExpenseCategory, description: string, cost: number) => {

        console.log('addExpense');
        
        const userIdx = users.findIndex(user => user.id === userId);
        users[userIdx].addExpense(new Expense(category, description, cost));

        peristToLocalStorage();

    }

    const removeExpense = (userId: string, expenseId: string) => {
        const userIdx = users.findIndex(user => user.id === userId);
        const newExpenses = users[userIdx].getExpenses().filter(expense => expenseId !== expense.id);
        users[userIdx].setExpenses(newExpenses);
        peristToLocalStorage();
    }

    const editExpense = (
        userId: string, 
        expenseId: string,
        category: ExpenseCategory, 
        description: string, 
        cost: number
    ) => {

        const allExpenses = users.map(user => {
            const userExp = user.getExpenses()
            const coll = userExp.map(exp => ({
                userId: user.id, 
                expenseId: exp.id, 
                category: exp.getCategory(), 
                description: exp.getDescription(), 
                cost: exp.getCost()
            }));
            return coll;
        })

        const allExpensesFlat = allExpenses.flat();

        console.log('flat', allExpensesFlat);

        const idx = allExpensesFlat.findIndex(exp => exp.expenseId === expenseId);
        const userIdx = users.findIndex(usr => usr.id === userId)


        console.log('idx', idx);

        if(allExpensesFlat[idx].userId !== userId){
            console.log('user change');
            addExpense(userId, category, description, cost);
            const oldUserId = allExpensesFlat.find(exp => exp.expenseId === expenseId).userId;
            const oldUserIndex = users.findIndex(usr => usr.id === oldUserId);
            users[oldUserIndex].removeExpense(expenseId);
        }else{
            const userExpIdx = users[userIdx].getExpenses().findIndex(exp => exp.id === expenseId);
            users[userIdx].getExpenses()[userExpIdx].editCategory(category);
            users[userIdx].getExpenses()[userExpIdx].editDescription(description);
            users[userIdx].getExpenses()[userExpIdx].editCost(cost);
        }

        users[userIdx].updateExpenseTotal();

        peristToLocalStorage();

    }


    const fetchExpenseByCategory = (category: ExpenseCategory) => {

        const coll = users.map(user => {
            return user.getExpenses().filter(exp => exp.getCategory() === category)
        })

        const collFlat = coll.flat();

        return collFlat.map(exp => exp.getCost()).reduce((acc, cost) => acc += cost, 0);


    }

    const peristToLocalStorage = () => {
        console.log('persist to storage');
        localStorage.clear();
        localStorage.setItem('userData', JSON.stringify(users));
    }

    const fetchFromLocalStorage = () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        for(let user of userData){

            const expenses = user.expenses.map(exp => new Expense(
                exp.category, 
                exp.description, 
                exp.cost, 
                exp.id
            ))

            users.push(new User(
                user.firstName, 
                user.lastName, 
                expenses, 
                user.expenseTotal, 
                user.id
            ))
        }
    }

    return {
        users, 
        addUser, 
        deleteUser, 
        getUserById, 
        editUser, 
        fetchAllExpenses, 
        addExpense, 
        removeExpense, 
        editExpense, 
        fetchExpenseByCategory, 
        peristToLocalStorage, 
        fetchFromLocalStorage
    }

});
