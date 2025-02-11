import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { memo, useCallback } from 'react'
import { HiPlus } from 'react-icons/hi'
import { useAppContext } from '@store/hooks'

import { useCreateTag } from '@hooks/tags'
import { NewTagDialog } from './tag-dialog'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate: createTag } = useCreateTag()

  const { selectedWebId } = useAppContext()

  const handleSubmit = useCallback(
    (data) => {
      onClose()
      createTag({
        ...data,
        locationId: selectedWebId,
      })
    },
    [createTag, onClose, selectedWebId],
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
          New tag
        </Button>
      </Flex>
      <NewTagDialog isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} />
    </>
  )
}

export default memo(Header)
