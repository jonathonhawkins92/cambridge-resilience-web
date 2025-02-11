/* eslint-disable sonarjs/cognitive-complexity */
import { memo, useEffect, useMemo } from 'react'
import {
  Formik,
  Form,
  Field,
  useField,
  FieldProps,
  useFormikContext,
} from 'formik'
import { Editor } from '@tinymce/tinymce-react'
import ReactSelect from 'react-select'
import type { Options } from 'react-select'
import { Category } from '@prisma/client'
import {
  chakra,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  HStack,
  Text,
} from '@chakra-ui/react'
import {
  emailValidator,
  fieldRequiredValidator,
  urlValidator,
} from '@helpers/formValidation'
import ImageUpload from './ImageUpload'
import { useTags } from '@hooks/tags'
import { useListings } from '@hooks/listings'
import { useAppContext } from '@store/hooks'

const EditorField = (props) => {
  const { label, name, ...otherProps } = props
  const [field, meta] = useField(name)
  const type = 'text'
  const handleEditorChange = (value) => {
    field.onChange({ target: { type, name, value } })
  }

  const handleBlur = () => {
    field.onBlur({ target: { name } })
  }

  return (
    <>
      {label && <label>{label}</label>}
      <Editor
        {...otherProps}
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_APIKEY}
        value={field.value}
        onEditorChange={handleEditorChange}
        onBlur={handleBlur}
        init={{
          height: 500,
          menubar: 'file edit view insert format tools table tc help',
          toolbar: true,
          plugins:
            'media advlist autolink lists link anchor image code fullscreen table paste code emoticons help',
          selector: 'textarea',
        }}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  )
}

const SlugField = () => {
  const { selectedWebSlug } = useAppContext()
  const {
    values: { title },
    setFieldValue,
  } = useFormikContext<any>()

  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/gi, '')
      .trim()

    if (title.trim() !== '') {
      setFieldValue('slug', generatedSlug)
    }
  }, [setFieldValue, title])

  return (
    <Field name="slug" validate={urlValidator}>
      {({ field, form }: FieldProps) => {
        return (
          <FormControl
            isInvalid={Boolean(form.errors.slug && form.touched.slug)}
          >
            <FormLabel htmlFor="slug" fontSize="sm">
              Url
            </FormLabel>
            <InputGroup size="sm">
              <InputLeftAddon
                bg="gray.50"
                color="gray.500"
                rounded="md"
                userSelect="none"
              >
                {`${selectedWebSlug}.resilienceweb.org.uk/`}
              </InputLeftAddon>
              <Input
                {...field}
                id="slug"
                fontSize="sm"
                shadow="sm"
                size="sm"
                rounded="md"
              />
            </InputGroup>
            <FormErrorMessage>{form.errors.slug?.toString()}</FormErrorMessage>
          </FormControl>
        )
      }}
    </Field>
  )
}

const customMultiSelectStyles = {
  container: (baseStyles) => ({
    ...baseStyles,
    width: '100%',
  }),
  menuPortal: (baseStyles) => ({
    ...baseStyles,
    zIndex: 10,
  }),
}

interface Props {
  categories: Category[]
  listing?: Listing
  handleSubmit: (data: any) => void
}

type TagOption = {
  value: number
  label: string
}

const ListingForm = ({ categories, listing, handleSubmit }: Props) => {
  const { tags } = useTags()
  const { listings } = useListings()

  const tagOptions: Options<TagOption> = useMemo(() => {
    if (!tags) return []

    return tags.map((t) => ({
      value: t.id,
      label: t.label,
    }))
  }, [tags])

  const relationOptions: Options<TagOption> = useMemo(() => {
    if (!listings) return []

    return listings
      .filter((l) => l.title !== listing?.title)
      .map((l) => ({
        value: l.id,
        label: l.title,
      }))
  }, [listing?.title, listings])

  const initialTagsValues = useMemo(() => {
    return listing?.tags.map((t) => ({
      value: t.id,
      label: t.label,
    }))
  }, [listing?.tags])

  const initialRelationsValues = useMemo(() => {
    return listing?.relations.map((l) => ({
      value: l.id,
      label: l.title,
    }))
  }, [listing?.relations])

  const handleSubmitForm = (data) => {
    data.tags = data.tags?.map((t) => t.value)
    data.relations = data.relations?.map((l) => l.value)
    if (listing) {
      const currentListingTagIds = listing?.tags.map((t) => t.id)
      const removedTags = currentListingTagIds.filter(
        (t) => !data.tags.includes(t),
      )
      data.removedTags = removedTags

      const currentListingRelationIds = listing?.relations.map((r) => r.id)
      const removedRelations = currentListingRelationIds.filter(
        (l) => !data.relations.includes(l),
      )
      data.removedRelations = removedRelations
    }
    handleSubmit(data)
  }

  return (
    <Formik
      initialValues={{
        id: listing?.id || null,
        title: listing?.title || '',
        description: listing?.description || '',
        category: listing?.categoryId || categories[0].id,
        email: listing?.email || '',
        website: listing?.website || '',
        facebook: listing?.facebook || '',
        twitter: listing?.twitter || '',
        instagram: listing?.instagram || '',
        seekingVolunteers: listing?.seekingVolunteers || false,
        inactive: listing?.inactive || false,
        image: listing?.image,
        slug: listing?.slug || '',
        tags: initialTagsValues || [],
        relations: initialRelationsValues || [],
      }}
      enableReinitialize
      onSubmit={handleSubmitForm}
    >
      {(props) => {
        return (
          <Form encType="multipart/form-data">
            <chakra.div p={{ sm: 6 }} px={4} py={5}>
              <chakra.div mb={3}>
                <Field name="title" validate={fieldRequiredValidator}>
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={Boolean(
                        form.errors.title && form.touched.title,
                      )}
                    >
                      <FormLabel htmlFor="title" fontSize="sm">
                        Title
                      </FormLabel>
                      <Input
                        {...field}
                        id="title"
                        fontSize="sm"
                        shadow="sm"
                        size="sm"
                        rounded="md"
                      />
                      <FormErrorMessage>
                        {form.errors.title?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </chakra.div>

              <chakra.div mb={3}>
                <Field
                  name="description"
                  style={{
                    maxHeight: '200px',
                  }}
                >
                  {({ form }: FieldProps) => (
                    <FormControl
                      isInvalid={Boolean(
                        form.errors.description && form.touched.description,
                      )}
                    >
                      <FormLabel htmlFor="description" fontSize="sm">
                        Description
                      </FormLabel>
                      <EditorField name="description" />
                      <FormErrorMessage>
                        {form.errors.description?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </chakra.div>

              <chakra.div mb={3}>
                <Field name="category">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={Boolean(
                        form.errors.category && form.touched.category,
                      )}
                    >
                      <FormLabel htmlFor="category" fontSize="sm">
                        Category
                      </FormLabel>
                      <Select
                        {...field}
                        fontSize="sm"
                        shadow="sm"
                        size="sm"
                        rounded="md"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {form.errors.category?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </chakra.div>

              <chakra.div mb={3}>
                <Field name="email" type="email" validate={emailValidator}>
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={Boolean(
                        form.errors.email && form.touched.email,
                      )}
                    >
                      <FormLabel htmlFor="email" fontSize="sm">
                        Email
                      </FormLabel>
                      <Input
                        {...field}
                        id="email"
                        fontSize="sm"
                        shadow="sm"
                        size="sm"
                        rounded="md"
                      />
                      <FormErrorMessage>
                        {form.errors.email?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </chakra.div>

              <Field name="image">
                {({ field, form }: FieldProps) => (
                  <ImageUpload field={field} form={form} formProps={props} />
                )}
              </Field>

              <HStack align="stretch" spacing={2} mt={4}>
                <chakra.div mb={3} flexGrow={1}>
                  <Field name="website">
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={Boolean(
                          form.errors.website && form.touched.website,
                        )}
                      >
                        <FormLabel htmlFor="title" fontSize="sm">
                          Website
                        </FormLabel>
                        <Input
                          {...field}
                          id="website"
                          fontSize="sm"
                          shadow="sm"
                          size="sm"
                          rounded="md"
                        />
                        <FormErrorMessage>
                          {form.errors.website?.toString()}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </chakra.div>

                <chakra.div mb={3} flexGrow={1}>
                  <Field name="facebook">
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={Boolean(
                          form.errors.facebook && form.touched.facebook,
                        )}
                      >
                        <FormLabel htmlFor="facebook" fontSize="sm">
                          Facebook
                        </FormLabel>
                        <Input
                          {...field}
                          id="facebook"
                          fontSize="sm"
                          shadow="sm"
                          size="sm"
                          rounded="md"
                        />
                        <FormErrorMessage>
                          {form.errors.facebook?.toString()}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </chakra.div>
              </HStack>

              <HStack align="stretch" spacing={2}>
                <chakra.div mb={3} flexGrow={1}>
                  <Field name="twitter">
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={Boolean(
                          form.errors.twitter && form.touched.twitter,
                        )}
                      >
                        <FormLabel htmlFor="twitter" fontSize="sm">
                          Twitter
                        </FormLabel>
                        <Input
                          {...field}
                          id="twitter"
                          fontSize="sm"
                          shadow="sm"
                          size="sm"
                          rounded="md"
                        />
                        <FormErrorMessage>
                          {form.errors.twitter?.toString()}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </chakra.div>

                <chakra.div mb={3} flexGrow={1}>
                  <Field name="instagram">
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={Boolean(
                          form.errors.instagram && form.touched.instagram,
                        )}
                      >
                        <FormLabel htmlFor="instagram" fontSize="sm">
                          Instagram
                        </FormLabel>
                        <Input
                          {...field}
                          id="instagram"
                          fontSize="sm"
                          shadow="sm"
                          size="sm"
                          rounded="md"
                        />
                        <FormErrorMessage>
                          {form.errors.instagram?.toString()}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </chakra.div>
              </HStack>

              <chakra.div mb={3}>
                <SlugField />
              </chakra.div>

              <chakra.div mb={3}>
                <Field name="tags">
                  {({ field, form }: FieldProps) => {
                    return (
                      <FormControl
                        isInvalid={Boolean(
                          form.errors.tags && form.touched.tags,
                        )}
                      >
                        <FormLabel htmlFor="tags" fontSize="sm">
                          Tags
                        </FormLabel>
                        <InputGroup size="sm">
                          <ReactSelect
                            isMulti
                            isSearchable={false}
                            menuPortalTarget={document.body}
                            onChange={(_option, changeData) => {
                              let newValue
                              if (changeData.action === 'select-option') {
                                newValue = [...field.value, changeData.option]
                              } else if (
                                changeData.action === 'remove-value' ||
                                changeData.action === 'pop-value'
                              ) {
                                newValue = field.value.filter(
                                  (v) =>
                                    v.value !== changeData.removedValue.value,
                                )
                              }
                              form.setFieldValue(field.name, newValue)
                            }}
                            options={tagOptions.filter((t) => {
                              return !field.value.includes(t)
                            })}
                            placeholder="Tags"
                            value={field.value}
                            isClearable={false}
                            styles={customMultiSelectStyles}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {form.errors.tags?.toString()}
                        </FormErrorMessage>
                      </FormControl>
                    )
                  }}
                </Field>
              </chakra.div>

              <chakra.div mb={3}>
                <Field name="relations">
                  {({ field, form }: FieldProps) => {
                    return (
                      <FormControl
                        isInvalid={Boolean(
                          form.errors.relations && form.touched.relations,
                        )}
                      >
                        <FormLabel htmlFor="relations" fontSize="sm">
                          Relations
                        </FormLabel>
                        <InputGroup size="sm">
                          <ReactSelect
                            isMulti
                            isSearchable
                            menuPortalTarget={document.body}
                            onChange={(_option, changeData) => {
                              let newValue
                              if (changeData.action === 'select-option') {
                                newValue = [...field.value, changeData.option]
                              } else if (
                                changeData.action === 'remove-value' ||
                                changeData.action === 'pop-value'
                              ) {
                                newValue = field.value.filter(
                                  (v) =>
                                    v.value !== changeData.removedValue.value,
                                )
                              }
                              form.setFieldValue(field.name, newValue)
                            }}
                            options={relationOptions.filter(
                              (t) => !field?.value?.includes(t),
                            )}
                            placeholder="Relations"
                            value={field.value}
                            isClearable={false}
                            styles={customMultiSelectStyles}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {form.errors.relations?.toString()}
                        </FormErrorMessage>
                      </FormControl>
                    )
                  }}
                </Field>
                <Text color="gray.500" fontSize="sm">
                  What other listings is it related to?
                </Text>
              </chakra.div>

              <chakra.div mb={3}>
                <Field name="seekingVolunteers">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={Boolean(
                        form.errors.seekingVolunteers &&
                          form.touched.seekingVolunteers,
                      )}
                    >
                      <Checkbox
                        isChecked={field.value}
                        id="seekingVolunteers"
                        onChange={field.onChange}
                      >
                        Seeking volunteers
                      </Checkbox>
                      <Text color="gray.500" fontSize="sm">
                        Would this group benefit from having additional
                        volunteers?
                      </Text>
                      <FormErrorMessage>
                        {form.errors.seekingVolunteers?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </chakra.div>

              <chakra.div mb={3}>
                <Field name="inactive">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={Boolean(
                        form.errors.inactive && form.touched.inactive,
                      )}
                    >
                      <Checkbox
                        isChecked={field.value}
                        id="inactive"
                        onChange={field.onChange}
                      >
                        Inactive
                      </Checkbox>
                      <Text color="gray.500" fontSize="sm">
                        Has the group been inactive for a while?
                      </Text>
                      <FormErrorMessage>
                        {form.errors.inactive?.toString()}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </chakra.div>
            </chakra.div>

            <Box px={{ base: 4, sm: 6 }} py={3} bg="gray.50" textAlign="right">
              <Button
                bg="rw.700"
                colorScheme="rw.700"
                disabled={!props.isValid}
                isLoading={props.isSubmitting}
                size="md"
                type="submit"
                _hover={{ bg: 'rw.900' }}
              >
                {listing ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Form>
        )
      }}
    </Formik>
  )
}

export default memo(ListingForm)
