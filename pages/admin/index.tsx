import { signIn, useSession } from 'next-auth/react'
import { memo, useEffect, useMemo } from 'react'
import { Center, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import LayoutContainer from '@components/admin/layout-container'
import EditableList from '@components/admin/editable-list'
import { useListings, useDeleteListing } from '@hooks/listings'
import { usePermissions } from '@hooks/permissions'
import { useAppContext } from '@store/hooks'

const Admin = () => {
  const { data: session, status: sessionStatus } = useSession()
  const { selectedWebId } = useAppContext()

  const {
    listings,
    isLoading: isLoadingListings,
    isError: isListingsError,
  } = useListings()
  const { permissions, isLoading: isLoadingPermissions } = usePermissions()
  const { mutate: deleteListing } = useDeleteListing()

  const { query } = useRouter()
  useEffect(() => {
    if (!session && sessionStatus !== 'loading') {
      if (query.activate) {
        void signIn('email', { email: query.activate })
      } else {
        signIn().catch((e) => console.error(e))
      }
    }
  }, [session, sessionStatus, query.activate])

  const allowedListings = useMemo(() => {
    if (!session || isLoadingPermissions || isLoadingListings) return null
    if (session.user.admin) return listings

    if (permissions?.webIds.includes(selectedWebId)) return listings

    return listings.filter((listing) => {
      return permissions?.listingIds.includes(listing.id)
    })
  }, [
    session,
    isLoadingPermissions,
    isLoadingListings,
    listings,
    permissions?.webIds,
    permissions?.listingIds,
    selectedWebId,
  ])

  if (sessionStatus === 'loading') {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (isLoadingListings || isLoadingPermissions) {
    return (
      <LayoutContainer>
        <Center height="100%">
          <Spinner size="xl" />
        </Center>
      </LayoutContainer>
    )
  }

  if (isListingsError) {
    // eslint-disable-next-line no-console
    console.error('Error fetching listings')
  }

  if (!session) return null

  return (
    <LayoutContainer>
      <EditableList
        deleteListing={deleteListing}
        isAdmin={session.user.admin}
        items={allowedListings}
      />
    </LayoutContainer>
  )
}

Admin.auth = true

export default memo(Admin)
