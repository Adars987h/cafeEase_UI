import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Switch, Box, Card, Typography, Stack, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit, Delete } from '@mui/icons-material';

/**
 * Six columns do not fit a phone. Below the md breakpoint each product renders
 * as a card instead of a row; above it, the table is unchanged.
 */
const ProductTable = ({ products, onEdit, onDelete, onStatusToggle }) => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));

  const actions = (product) => (
    <>
      <IconButton onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}>
        <Edit fontSize="small" />
      </IconButton>
      <IconButton onClick={() => onDelete(product.id)} aria-label={`Delete ${product.name}`}>
        <Delete fontSize="small" />
      </IconButton>
    </>
  );

  const stockSwitch = (product) => (
    <Switch
      checked={product.status === 'true'}
      onChange={() => onStatusToggle(product.id, product.status !== 'true')}
      color="primary"
      inputProps={{ 'aria-label': `In stock: ${product.name}` }}
    />
  );

  if (isCompact) {
    return (
      <Stack spacing={1.5} sx={{ pb: 2 }}>
        {products.map((product) => (
          <Card
            key={product.id}
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, borderColor: 'divider' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.categoryName}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                &#8377;{product.price}
              </Typography>
            </Box>

            {product.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {product.description}
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
                pt: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {stockSwitch(product)}
                <Typography variant="body2" color="text.secondary">
                  {product.status === 'true' ? 'In stock' : 'Out of stock'}
                </Typography>
              </Box>
              <Box>{actions(product)}</Box>
            </Box>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead sx={{ backgroundColor: 'background.default' }}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>In stock</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} hover>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.categoryName}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>&#8377;{product.price}</TableCell>
              <TableCell>{stockSwitch(product)}</TableCell>
              <TableCell>{actions(product)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ProductTable;
