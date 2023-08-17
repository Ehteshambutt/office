import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DemoContent from '@fuse/core/DemoContent';
import axios from 'axios'
// import AddIcon from 'assets/add.png'
import { Grid, Snackbar, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
// import { confirmAlert } from 'react-confirm-alert'
import { createBrowserHistory } from 'history'
import { DataGrid } from '@mui/x-data-grid'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';

const history = createBrowserHistory({ forceRefresh: true })
const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}));

function Patient(props) {
  const { t } = useTranslation('examplePage');
  const gridStyle = {
    color: '#8392ab !important',
    textTransform: 'lowercase',
    fontSize: '13.6px',
    fontWeight: '400',
    '&:hover': {
      color: 'rgba(5, 152, 236, 0.637) !important',
      fontSize: '14.6px',
    },
  }

  const gridRowStyle = {
    boxShadow: 2,
    border: 2,
    borderRadius: 2,
    background: 'white',
    fontSize: '13.6px !important',
    color: 'dark !important',
    borderColor: 'rgba(5, 152, 236, 0.637) !important',
    '& .MuiDataGrid-cell:hover': {
      color: 'rgba(5, 152, 236, 0.637) !important',
      fontSize: '14.6px !important',
    },
    '& .super-app-theme--header': {
      backgroundColor: '#FFFFC2',
       borderRadius: 1.8,
    },
  }
  const [refresh, setRefresh] = useState(false)

  const columns = [
    {
      field: 'practiceName',
      headerName: 'Practice Name',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'gridCell',
      sortable: false,
      flex: 1.0,
    //   renderCell: (cellValues) => (
    //     <SuiButton
    //       variant="text"
    //       color="dark"
    //       onClick={(event) => {
    //         openUserRegistration(event, cellValues.row.id)
    //       }}
    //     >{`${cellValues.row.practiceName}`}</SuiButton>
    //   ),
    },
    {
      field: 'taxId',
      headerName: 'Tax Id',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'gridCell',
      sortable: false,
      flex: 0.3,
    },
    {
      field: 'address',
      headerClassName: 'super-app-theme--header',
      headerName: 'Address',
      cellClassName: 'gridCell',
      sortable: false,
      flex: 0.5,
    },
    {
      field: 'city',
      headerClassName: 'super-app-theme--header',
      headerName: 'City',
      cellClassName: 'gridCell',
      sortable: false,
      flex: 0.5,
    },
    {
      field: 'state',
      headerClassName: 'super-app-theme--header',
      headerName: 'State',
      cellClassName: 'gridCell',
      sortable: false,
      flex: 0.5,
    },
    {
      field: 'phoneNo',
      headerClassName: 'super-app-theme--header',
      headerName: 'PhoneNo',
      sortable: true,
      flex: 0.5,
    },
    // {
    //   field: 'delete',
    //   headerClassName: 'super-app-theme--header',
    //   headerName: 'Delete',
    //   sortable: true,
    //   flex: 0.3,
    //   renderCell: (cell) => (
    //     <DeleteIcon
    //       style={{
    //         marginRight: '5px',
    //         float: 'right',
    //         marginTop: '5px',
    //       }}
    //       color="black"
    //       onClick={(cellValues) => {
    //         // console.log('Cell: ', cell)
    //         confirmAlert({
    //           message: 'Do you want to delete the record.',
    //           closeOnEscape: true,
    //           closeOnClickOutside: true,
    //           overlayClassName: 'overlay-custom-class-name',
    //           buttons: [
    //             {
    //               label: 'Yes',
    //               onClick: () => {
    //                 const postData = {
    //                   taxId: cell.row.taxId,
    //                   address: cell.row.address,
    //                   website: cell.row.website,
    //                   phoneNo: cell.row.phoneNo,
    //                   id: cell.row.id,
    //                   deleted: true,
    //                   city: cell.row.city,
    //                   practiceName: cell.row.practiceName,
    //                 }

    //                 axios
    //                   .post(
    //                     `${process.env.REACT_APP_API_URL}/Practices/addPractice`,
    //                     postData,
    //                     {
    //                       headers,
    //                     }
    //                   )
    //                   .then((response) => {
    //                     setRefresh(!refresh)
    //                     // setOpenNote(false)
    //                     // console.log('response.data: ', response.data)
    //                   })
    //                   .catch((error) => {
    //                     console.error('There was an error!', error)
    //                   })
    //               },
    //             },
    //             {
    //               label: 'No',
    //             },
    //           ],
    //         })
    //       }}
    //     ></DeleteIcon>
    //   ),
    // },
  ]

  const [rows, setRows] = useState(null)
//   const auth = `Bearer  ${localStorage.getItem('dtt_token')}`
//   const headers = {
//     Authorization: auth,
//   }
  useEffect(() => {
    
    axios
      .get(`${process.env.REACT_APP_API_URL}/Patients/getPatients`,
        null
      )
      .then((response) => setRows(response.data))
      .catch((error) => {
        console.error('There was an error!', error)
      })

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [refresh])
// const openUserRegistration = (event, id) => {
//     console.log('Clicked UserEmail: ', id)
//     history.push({
//       pathname: `/Demographics`,
//       state: { userId: id },
//     })
//   }
  return (
    <>
      <Grid
        container
        spacing={1}
        style={{
          paddingTop: '10px',
          paddingLeft: '10px',
          paddingRight: '50px',
        }}
      >
        <Grid item xs={6} style={{ width: '300px' }}>
          <Box mb={3}>
            <Button
              sx={{ mb: 5 }}
            //   onClick={openUserRegistration}
              variant="gradient"
              color="info"
              size="small"
              style={{
                width: '80px',
                height: '33px',
                backgroundColor: '#FCBE13',
                color: 'black',
                fontSize: '14px',
              }}
            >
              <AddOutlinedIcon
                fontSize="medium"
                style={{
                  color: '#1a82ad',
                  paddingRight: '4px',
                  paddingBottom: '2px',
                }}
              ></AddOutlinedIcon>
              New
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} style={{ width: '300px' }}>
          <Box mb={3}>
            <div style={{ height: 400, width: '100%' }}>
              {rows === null || rows.length === 0 ? null : (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  headerHeight={37}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  sx={gridRowStyle}
                />
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Patient;
