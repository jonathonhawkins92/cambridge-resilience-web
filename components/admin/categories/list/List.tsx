import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { memo, useCallback, useState } from 'react'

import CategoryTag from '@components/category-tag'
import { useUpdateCategory } from '@hooks/categories'
import { UpdateCategoryDialog } from '../header/category-dialog'

const columns = [
  {
    Header: 'Category label',
    accessor: 'label',
  },
  {
    Header: 'Color',
    accessor: 'color',
  },
]

const List = ({ categories }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate: updateCategory } = useUpdateCategory()

  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId,
  )

  const handleOpen = (categoryId) => {
    setSelectedCategoryId(categoryId)
    onOpen()
  }

  const handleSubmit = useCallback(
    (data) => {
      onClose()
      updateCategory({
        ...data,
        id: selectedCategoryId,
      })
    },
    [onClose, updateCategory, selectedCategoryId],
  )

  if (!categories) {
    return null
  }

  return (
    <>
      <Table borderWidth="1px" fontSize="sm" background="#ffffff" mb={'2rem'}>
        <Thead bg={'gray.50'}>
          <Tr>
            {columns.map((column, index) => (
              <Th whiteSpace="nowrap" scope="col" key={index}>
                {column.Header}
              </Th>
            ))}
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((row) => (
            <Tr key={row.id}>
              {columns.map((column, index) => {
                const cell = row[column.accessor]

                if (column.accessor === 'color') {
                  return (
                    <Td key={index} width="100px">
                      <CategoryTag colorHex={cell}>{`#${cell}`}</CategoryTag>
                    </Td>
                  )
                }

                return (
                  <Td key={index} maxWidth="100px">
                    {cell}
                  </Td>
                )
              })}
              <Td textAlign="right" maxWidth="80px">
                <Stack direction="column" spacing={2}>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleOpen(row.id)}
                    size="sm"
                  >
                    Edit
                  </Button>
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <UpdateCategoryDialog
        category={selectedCategory}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default memo(List)
