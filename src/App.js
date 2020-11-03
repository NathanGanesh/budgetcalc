import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import { v4 as uuid } from 'uuid';
import React, { useState, useEffect } from 'react';

import './App.css';
// const initialExpenses = [
// 	{ id: uuid(), charge: 'rent', amount: 1600 },
// 	{ id: uuid(), charge: 'car payment', amount: 400 },
// 	{
// 		id: uuid(),
// 		charge: 'credit card bill ',
// 		amount: 1200
// 	}
// ];

const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];
function App() {
	const [ expenses, setExpenses ] = useState(initialExpenses);
	const [ charge, setCharge ] = useState('');
	const [ amount, setAmount ] = useState('');
	const [ alert, setAlert ] = useState({ show: false });
	const [ edit, setEdit ] = useState(false);
	const [ id, setId ] = useState(0);

	const handleCharge = (e) => {
		setCharge(e.target.value);
	};
	// add amount
	const handleAmount = (e) => {
		let amount = e.target.value;
		if (amount === '') {
			setAmount(amount);
		} else {
			setAmount(parseInt(amount));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (charge !== '' && parseInt(amount) > 0) {
			console.log(edit);
			if (edit) {
				let tempExpenses = expenses.map((item) => {
					return item.id === id ? { ...item, charge, amount } : item;
				});
				setExpenses(tempExpenses);
				setEdit(false);
			} else {
				const singleExpense = { id: uuid(), charge, amount };
				setExpenses([ ...expenses, singleExpense ]);
				handleAlert({ type: 'success', text: 'item added' });
			}
			setCharge('');
			setAmount('');
		} else {
			handleAlert({
				type: 'danger',
				text: `charge can't be empty value and amount value has to be bigger than zero`
			});
		}
	};

	const handleDelete = (id) => {
		// console.log(id);
		let tempExpenses = expenses.filter((item) => item.id !== id);
		setExpenses(tempExpenses);
		handleAlert({ type: 'danger', text: 'item deleted' });
	};

	const handleEdit = (id) => {
		let expense = expenses.find((item) => item.id === id);
		let { charge, amount } = expense;
		setCharge(charge);
		setAmount(parseInt(amount));
		setEdit(true);
		setId(id);
	};

	//clear all items
	const clearItems = () => {
		setExpenses([]);
	};

	const handleAlert = ({ type, text }) => {
		setAlert({ show: true, type, text });
		setTimeout(() => {
			setAlert({ show: false });
		}, 7000);
	};

	return (
		<React.Fragment>
			{alert.show && <Alert type={alert.type} text={alert.text} />}
			<h1>Budget calculator</h1>
			<main className="App">
				<ExpenseForm
					charge={charge}
					amount={amount}
					handleAmount={handleAmount}
					handleCharge={handleCharge}
					handleSubmit={handleSubmit}
					edit={edit}
				/>
				<ExpenseList
					expenses={expenses}
					handleDelete={handleDelete}
					handleEdit={handleEdit}
					clearItems={clearItems}
				/>
			</main>
			<h1>
				total spending :{' '}
				<span className="total">
					${' '}
					{expenses.reduce((acc, curr) => {
						return (acc += parseInt(curr.amount));
					}, 0)}
				</span>
			</h1>
		</React.Fragment>
	);
}

export default App;
