import React, { useState, useEffect } from 'react'
import EditStudentForm from "./EditStudentForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment ,Avatar} from '@material-ui/core';
import useTable from "../../components/useTable";
import * as studentService from "../../services/studentService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import Popup from "../../components/Popup";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Header from '../../components/Header';

import ActionButton from '../../components/controls/ActionButton';
import * as Action from '../../store/action/studentAction'
import { useSelector, useDispatch } from 'react-redux';





const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))


const headCells = [
    { id: 'photo', label: 'Avatar' },
    { id: 'firstName', label: 'First Name' },
    { id: 'fatherName', label: 'Father Name' },
    { id: 'email', label: 'Email' },
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Students() {


    const dispatch = useDispatch();
    const students = useSelector(state => state.student.userStudents);
    
    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState(students)
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [openPopup, setOpenPopup] = useState(false);
 




    const init = () => {
        dispatch(Action.fetchStudents());    
    }

    useEffect(() => {
        init();
     
        setRecords(students)
    }, [ students, recordForEdit]);

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value == "")
                    return items;
                else
                    return items.filter(x => x.firstName.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = (student, resetForm) => {
        dispatch(Action.updateStudent(student));
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
       // setRefresher(!refresher);

    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }
    const handleDelete = item => {
        dispatch(Action.deleteStudent(item)); 
    }

    return (
        <>
            <Header />
            <PageHeader
                title="View Students"
                subTitle="View and update all students here"
                icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>

                <Toolbar>
                    <Controls.Input
                        label="Search Students"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    {/* <Controls.Button
                        text="Add New"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        className={classes.newButton}
                        onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
                    /> */}
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item =>
                                (<TableRow key={item.id}>
                                    <TableCell>
                                    <Avatar alt="i" src= {item.photo} className={classes.large} />
                                        </TableCell>
                                    <TableCell>{item.firstName}</TableCell>
                                    <TableCell>{item.fatherName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick={() => { openInPopup(item) }}>
                                            <EditOutlinedIcon fontSize="small" />
                                        </Controls.ActionButton>
                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={() => { handleDelete(item) }}>
                                            <CloseIcon fontSize="small" />
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Student Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <EditStudentForm
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit} />
            </Popup>
        </>
    )
}
