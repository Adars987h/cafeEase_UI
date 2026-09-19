import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ value, onSearch }) => (
  <TextField
    placeholder="Search products..."
    value={value}
    onChange={(e) => onSearch(e.target.value)}
    size="small"
    sx={{ minWidth: 260 }}
  />
);

export default SearchBar;
