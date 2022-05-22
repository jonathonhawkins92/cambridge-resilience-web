import { memo } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { NextSeo, LocalBusinessJsonLd } from 'next-seo'
import { useRouter } from 'next/router'
import { REMOTE_URL, REMOTE_HOSTNAME, PROTOCOL } from '@helpers/config'
import Layout from '@components/layout'
import { Listing as ListingType } from '@prisma/client'
import ListingDisplay from '@components/listing'

function Listing({ listing }: { listing: ListingType | any }) {
    const router = useRouter()
    if (router.isFallback) {
        return (
            <Layout>
                <h1>Please wait…</h1>
            </Layout>
        )
    }

    return (
        <>
            <NextSeo
                title={`${listing.title} | Cambridge Resilience Web`}
                openGraph={{
                    title: `${listing.title} | Cambridge Resilience Web`,
                    images: [{ url: listing.image }],
                }}
            />
            <LocalBusinessJsonLd
                type="Store"
                // id={`${PROTOCOL}://${listing.location.slug}.${REMOTE_HOSTNAME}/${listing.slug}`}
                address={{
                    addressCountry: 'GB',
                    addressLocality: 'Cambridge',
                    addressRegion: 'Cambridgeshire',
                }}
                name={listing.title}
                description={listing.description}
                id={''}
            />
            <Layout>
                <ListingDisplay listing={listing} />
            </Layout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async (context) => {
    const response = await fetch(`${REMOTE_URL}/api/listings`)
    const data = await response.json()
    const { listings } = data
    const paths = listings.map((l) => ({
        params: {
            slug: `/${l.slug}`,
            site: l.slug,
        },
    }))

    return {
        paths,
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const response = await fetch(`${REMOTE_URL}/api/listing/${params.slug}`)
    const data = await response.json()
    const { listing } = data

    return {
        props: {
            listing,
        },
        revalidate: 5,
    }
}

export default memo(Listing)
