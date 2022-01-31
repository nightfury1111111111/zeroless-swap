import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
	name: 'tokens',
	initialState: [],
	reducers: {
		addToken: (state, action) => {
			const token = {
				symbol: action.payload.symbol,
				value: action.payload.value,
			};
			state.push(token);
		},
		updateToken: (state, action) => {
			const index = state.findIndex((token) => token.symbol === action.payload.symbol);
			if (index !== -1)
				state[index].value = action.payload.value;
		},
		deleteTokens: () => {
			return []
		},
	},
})

export const { addToken, updateToken, deleteTokens } = tokenSlice.actions

export default tokenSlice.reducer
