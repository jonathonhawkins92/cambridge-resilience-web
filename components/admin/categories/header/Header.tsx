import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { memo, useCallback } from 'react'
import { HiPlus } from 'react-icons/hi'

import { useAppContext } from '@store/hooks'
import { useCreateCategory } from '@hooks/categories'
import { NewCategoryDialog } from './category-dialog'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate: createCategory } = useCreateCategory()

  const { selectedWebId } = useAppContext()

  const handleSubmit = useCallback(
    (data) => {
      onClose()
      createCategory({
        ...data,
        locationId: selectedWebId,
      })
    },
    [createCategory, onClose, selectedWebId],
  )

  return (
    <>
      <Flex justifyContent="flex-end" mb={8}>
        <Button
          bg="rw.700"
          colorScheme="rw.700"
          iconSpacing="1"
          leftIcon={<HiPlus fontSize="1.25em" />}
          onClick={onOpen}
          variant="solid"
          size="sm"
          _hover={{ bg: 'rw.900' }}
        >
          New category
        </Button>
      </Flex>
      <NewCategoryDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default memo(Header)
