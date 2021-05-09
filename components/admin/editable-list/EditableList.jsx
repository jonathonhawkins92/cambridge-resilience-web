import { useCallback, useEffect, useState } from 'react';
import {
	TreeList,
	TreeListToolbar,
	mapTree,
	extendDataItem,
	TreeListTextEditor,
	TreeListNumericEditor,
	TreeListDateEditor,
	TreeListBooleanEditor,
} from '@progress/kendo-react-treelist';
import CommandCell from './command-cell';

const editField = 'inEdit';

const EditableList = ({ items, updateOrganization }) => {
	const [data, setData] = useState(items);
	const [inEdit, setInEdit] = useState([]);

	useEffect(() => {
		setData(items);
	}, [items]);

	const enterEdit = useCallback((dataItem) => {
		setInEdit((inEdit) => [...inEdit, extendDataItem(dataItem)]);
	}, []);

	const cancelEdit = useCallback((dataItem) => {
		setInEdit((inEdit) => inEdit.filter((i) => i.id !== dataItem.id));
	}, []);

	const closeEdit = useCallback(() => {}, []);

	const handleItemChange = useCallback((event) => {
		setData((data) => {
			return mapTree(data, null, (item) =>
				item.id === event.dataItem.id
					? extendDataItem(item, null, { [event.field]: event.value })
					: item,
			);
		});
	}, []);

	const handleAddRecord = useCallback(() => {
		// TODO: open creation modal
	}, []);

	const handleSave = useCallback(
		(data) => {
			updateOrganization(data);
			cancelEdit(data);
		},
		[cancelEdit, updateOrganization],
	);

	if (!data) return null;

	return (
		<TreeList
			style={{ overflow: 'auto' }}
			data={mapTree(data, null, (item) =>
				extendDataItem(item, null, {
					[editField]: Boolean(inEdit.find((i) => i.id === item.id)),
				}),
			)}
			editField={editField}
			onItemChange={handleItemChange}
			columns={[
				{
					field: 'title',
					title: 'Title',
					width: 280,
					editCell: TreeListTextEditor,
				},
				{
					field: 'category',
					title: 'Category',
					width: 260,
					editCell: TreeListTextEditor,
				},
				{
					field: 'website',
					title: 'Website',
					width: 210,
					editCell: TreeListTextEditor,
				},
				{
					field: 'email',
					title: 'Email',
					width: 200,
					editCell: TreeListTextEditor,
				},
				{
					cell: CommandCell({
						cancel: cancelEdit,
						enterEdit: enterEdit,
						save: handleSave,
						editField,
					}),
					width: 300,
				},
			]}
			toolbar={
				<TreeListToolbar>
					<div onClick={closeEdit}>
						<button
							title="Add new"
							className="k-button k-primary"
							onClick={handleAddRecord}
						>
							Add new
						</button>
					</div>
				</TreeListToolbar>
			}
		/>
	);
};

export default EditableList;
