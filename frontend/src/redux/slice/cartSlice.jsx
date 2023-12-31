import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = {
    total: 0,
    amount: 0,
    books: [],
    totalSelected: 0,
    selected: []
};

const handleDuplicateBooks = (arr) => {
    const resultObj = {};
    arr.forEach((item) => {
        const { user_email, book_id, price_each, quantity_ordered } = item;
        if (resultObj[book_id]) {
            resultObj[book_id].quantity_ordered += quantity_ordered;
        } else {
            resultObj[book_id] = item;
        }
    })
    const new_arr = Object.values(resultObj);
    // console.log(new_arr, "and", resultObj);
    return new_arr;
}

const calcAmount = (arr) => {
    let amount = 0;
    arr.forEach((item) => {
        const { user_email, book_id, price_each, quantity_ordered } = item;
        amount += price_each * quantity_ordered;
    })
    return amount;
}

const findSelectedBook = (arr, bookId) => {
    const index = arr.findIndex(book => book.book_id === bookId);
    console.log(index);
    if (index !== -1) {
        return true;
    }
    return false;
}

export const cartSlice = createSlice({
    name: "cart", initialState, // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        deleteCart: (state, action) => {
            state.total = 0;
            state.books = initialState.books;
        },
        getCartAction: (state, action) => {
            // calc total
            const orderList = action.payload;
            let newTotal = 0;
            orderList.forEach((order) => {
                newTotal += order.quantity_ordered;
            })
            // console.log(">>>debug: ", action.payload),

            state.total = newTotal;
            state.books = handleDuplicateBooks(action.payload);
            // state.amount = calcAmount(action.payload);
        },
        addBookIntoCartAction: (state, action) => {
            state.total += action.payload.count;
        },
        deleteBookAction: (state, action) => {
            const bookIdToDelete = action.payload;
            const bookToDelete = state.books.find((book) => book.book_id === bookIdToDelete);

            if (bookToDelete) {
                state.total -= bookToDelete.quantity_ordered;
                if (findSelectedBook(state.selected, action.payload)) {
                    state.amount -= bookToDelete.price_each * bookToDelete.quantity_ordered;
                }


                state.books = state.books.filter((book) => book.book_id !== bookIdToDelete);
            }
            const isSelected = findSelectedBook(state.selected, bookIdToDelete);
            if (isSelected) {

                // state.selected.filter(book => book.book_id != bookIdToDelete);
                const index = state.selected.findIndex(book => book.book_id === bookIdToDelete);
                console.log(index);
                if (index !== -1) {
                    state.selected.splice(index, 1);
                }
                // state.amount -= bookToDelete.quantity_ordered * bookToDelete.price_each;
                state.totalSelected -= bookToDelete.quantity_ordered;
            }

        },
        increaseQuantityOrderedAction: (state, action) => {
            const bookIdToIncrease = action.payload;
            const bookToIncrease = state.books.find((book) => book.book_id === bookIdToIncrease);
            if (bookToIncrease) {
                state.total++;
                // state.amount += bookToIncrease.price_each;
                bookToIncrease.quantity_ordered++;
            }
            const isSelected = findSelectedBook(state.selected, bookIdToIncrease)
            if (isSelected) {
                state.totalSelected++;
                state.amount += bookToIncrease.price_each;
            }
        },
        decreaseQuantityOrderedAction: (state, action) => {
            const bookIdToDecrease = action.payload;
            const bookToDecrease = state.books.find((book) => book.book_id === bookIdToDecrease);
            if (bookToDecrease) {
                state.total--;
                // state.amount -= bookToDecrease.price_each;
                bookToDecrease.quantity_ordered--;
            }
            const isSelected = findSelectedBook(state.selected, bookIdToDecrease)
            if (isSelected) {
                state.totalSelected--;
                console.log(state.amount, typeof (state.amount), bookToDecrease.price_each);
                state.amount -= bookToDecrease.price_each;
            }
        },
        selectBookAction: (state, action) => {
            const { bookId, checked } = action.payload;
            console.log(action.payload);
            const selectedBook = state.books.find(book => book.book_id === bookId);
            if (checked) {
                state.selected.push(selectedBook);
            } else {
                const index = state.selected.findIndex(book => book.book_id === bookId);
                console.log(index);
                if (index !== -1) {
                    state.selected.splice(index, 1);
                }
            }
            const newTotal = state.selected.reduce((total, book) => total + book.quantity_ordered, 0);
            const newAmount = state.selected.reduce((amount, book) => amount + (book.price_each * book.quantity_ordered), 0);

            state.totalSelected = newTotal;
            state.amount = newAmount;
        },
        deleteSelectedAction: (state, action) => {
            state.total -= state.totalSelected;
            state.totalSelected = 0;
            state.selected = [];
            state.amount = 0;
        }
    }, // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
    },
});

export const { getCartAction, addBookIntoCartAction, deleteCart, deleteBookAction, increaseQuantityOrderedAction, decreaseQuantityOrderedAction, selectBookAction, deleteSelectedAction } = cartSlice.actions;

export default cartSlice.reducer;
