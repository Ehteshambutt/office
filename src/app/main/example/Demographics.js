import { useState, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React from 'react'
import Button from '@mui/material/Button'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { TabPanel, TabContext, TabList } from '@mui/lab'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select'
import InputMask from 'react-input-mask'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// import { useAlert } from 'react-alert'
// import Moment from 'moment'
import Avatar from '@mui/material/Avatar'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
// import FallbackSpinner from 'src/@core/components/spinner'
import Box from '@mui/material/Box'
import { MenuItem } from '@mui/material'

const fields = [
    'Id',
    'accountNumber',
    'lastName',
    'firstName',
    'midInitial',
    'title',
    'alias',
    'ssn',
    'dob',
    'gender',
    'status',
    'cellNo',
    'language',
    'maritalStatus',
    'homePhone',
    'cellPhone',
    'workPhone',
    'emailAddress',
    'city',
    'state',
    'zipCode',
    'address',
    'photoUrl',
    'comments',
    'practiceId',
    'isActive',
    'updatedBy',
    'updatedDate',
    'createdBy',
    'createdDate',
    'providerId',
    'facilityId',
    'careTeam_id',
    'estimatedMonthlyTime',
    'assignedTo',
    'dueDate',
    'careManagementStatus',
    'intakeStatus',
    'diagnosis1',
    'diagnosis2',
    'lastCommunicatedDate',
    'patientStarted',
    'salesRep',
    'socialWorker',
    'referralSource',
    'dischargeDate',
    'hmo',
    'ppo',
    'medicareStatus',
    'frequencyOfContact',
    'careManager',
    'leadCareManager',
    'intakeCoordinator',
    'inactiveDate',
    'initialVisitDate',
    'carePlanStatus',
    'additionalContactInfo',
    'pcpDoctorInfo',
    'careManagerSupervisor'
]
const defValues = {
    id: '',
    accountNumber: '',
    diagnosis1: '',
    lastCommunicatedDate: '',
    patientStarted: '',
    lastName: '',
    firstName: '',
    midInitial: '',
    title: '',
    alias: '',
    ssn: '',
    dob: '',
    gender: '',
    status: '',
    cellNo: '',
    language: '',
    maritalStatus: '',
    homePhone: '',
    cellPhone: '',
    workPhone: '',
    emailAddress: '',
    city: '',
    state: '',
    zipCode: '',
    address: '',
    photoUrl: '',
    comments: '',
    practiceId: '',
    isActive: '',
    updatedBy: '',
    updatedDate: '',
    createdBy: '',
    createdDate: '',
    providerId: '',
    facilityId: '',
    careTeam_id: '',
    estimatedMonthlyTime: '',
    assignedTo: '',
    dueDate: '',
    careManagementStatus: '',
    intakeStatus: '',
    diagnosis2: '',
    salesRep: '',
    socialWorker: '',
    referralSource: '',
    dischargeDate: '',
    hmo: '',
    ppo: '',
    medicareStatus: '',
    frequencyOfContact: '',
    careManager: '',
    leadCareManager: '',
    intakeCoordinator: '',
    inactiveDate: '',
    initialVisitDate: '',
    carePlanStatus: '',
    additionalContactInfo: '',
    pcpDoctorInfo: '',
    careManagerSupervisor: ''
}
const Demographics = props => {
    console.log('demog__________', props)
    const [isLoading, setisLoading] = useState(true)
    const getDate = () => {
        var dt = new Date()
        console.log('Date: ', dt.getMonth())
        const currentHours =
            dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2)
        return currentHours
    }
    const dispatch = useDispatch()

    // const token = localStorage.getItem('medAssistToken')

    // const auth = `Bearer ${token}`

    // const headers = {
    //     Authorization: auth
    // }
    //   const alert = useAlert()
    const [patientTo, setpatientTo] = useState('')

    const [zipDownloaded, setzipDownloaded] = useState(false)
    const [openPracMenu, setOpenPracMenu] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [fetchedData, setfetchedData] = useState(false)
    const [CareTeamList, setCareTeamList] = useState([])
    const [lastName, setLastName] = useState('')
    const [apiError, setApiError] = useState('')
    const [assigned, setassignedTo] = useState('')
    const today = new Date()
    var startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - 150)
    const validationSchema = Yup.object({
        firstName: Yup.string().required('First Name is required'),
        dob: Yup.date()
            .required('dob is required')
            .nullable()
            .transform(v => (v instanceof Date && !isNaN(v) ? v : null))
            .max(today, "You can't be born in the future!")
            .min(startDate, "You can't be that much old!")
    })

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        context: undefined,
        criteriaMode: 'firstError',
        shouldFocusError: true,
        shouldUnregister: false,
        shouldUseNativeValidation: false,
        delayError: undefined,
        resolver: yupResolver(validationSchema),
        defaultValues: defValues
    })
    const zipCodeListStyle = {
        cursor: 'pointer',
        '&:hover': {
            background: '#3b3b3b !important',
            color: 'rgba(5, 152, 236, 0.637) !important'
        }
    }
    const [phone, setPhone] = React.useState()

    const [duedate, setDuedate] = React.useState()
    const [inactiveDate, setinactiveDate] = React.useState()
    const [initialVisitDate, setinitialvisitDate] = React.useState()
    const [PatientStarted, setPatientStarted] = React.useState(`${getDate()}`)
    const [LastCommunicatedDate, setLastCommunicatedDate] = React.useState()
    const [DischargeDate, setDischargeDate] = React.useState()
    // const [Dob, setDob] = React.useState(Moment().format('YYYY-MM-DD'))
    const [cellPhone, setcellPhone] = React.useState()
    const [workPhone, setworkPhone] = React.useState()
    const [ssN, setssn] = React.useState()
    var time = new Date()
    console.log(time.toLocaleString('en-US', { hour: 'numeric', hour12: true }))
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
    return (
        <Box>
            <>
                <Grid container columnSpacing={1}>
                    <Grid item xs={12} style={{ marginLeft: "10px", marginTop: '10px' }}>
                        <Typography component='label' fontWeight={'bold'} color='black' fontSize='16px'>
                            Demographics
                        </Typography>
                    </Grid>
                    <Grid container style={{ marginTop: '30px' }}>
                        <Grid item xs={1}>
                        </Grid>
                        <Grid item xs={9}>
                            <Grid>
                                {' '}
                                <p style={{ color: 'red', fontSize: '14px' }}>{apiError}</p>
                            </Grid>
                            <Grid container columnSpacing={1}>
                                <Grid item xs={4}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        Email address
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        Last Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        First Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='emailAddress'
                                        {...register('emailAddress')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                size='small'
                                                placeholder='Please enter emailAddress'
                                                {...field}
                                                fullWidth
                                            // error={errors.emailAddress}
                                            />
                                        )}
                                    />
                                    {/* <p style={{ color: 'red', fontSize: '14px' }}>{errors.emailAddress?.message}</p> */}
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='lastName'
                                        {...register('lastName')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                // isClearable
                                                size='small'
                                                placeholder='Please enter last name'
                                                {...field}
                                                fullWidth
                                            // error={errors.lastName}
                                            />
                                        )}
                                    />
                                    {/* <p style={{ color: 'red', fontSize: '14px' }}>{errors.accountNumber?.message}</p> */}
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='firstName'
                                        {...register('firstName')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                // isClearable
                                                size='small'
                                                placeholder='Please enter First Name'
                                                {...field}
                                                fullWidth
                                                error={errors.firstName}
                                            />
                                        )}
                                    />
                                    <p style={{ color: 'red', fontSize: '14px' }}>{errors.firstName?.message}</p>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        DOB
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        Gender
                                    </Typography>
                                </Grid>

                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography htmlFor='phone-number' component='label' color='black' fontSize='12px'>
                                        SSN
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='dob'
                                        // {...register('firstName')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                type='date'
                                                size='small'
                                                fullWidth
                                                placeholder='Enter dob'
                                                // value={Dob}
                                                onChange={e => {
                                                    setValue('dob', e.target.value)
                                                    // setDob(e.target.value)
                                                }}
                                                error={errors.dob}
                                            />
                                        )}
                                    />
                                    <p style={{ color: 'red', fontSize: '14px' }}>{errors.dob?.message}</p>
                                </Grid>
                                <Grid item xs={4} style={{ paddingBottom: '0px' }}>
                                    <Controller
                                        name='gender'
                                        margin='dense'
                                        {...register('gender')}
                                        control={control}
                                        render={({ field }) => (
                                            <ReactSelect
                                                style={{ marginTop: 0, marginBottom: 0 }}

                                                {...field}
                                                options={[
                                                    { value: 'Male', label: 'Male' },
                                                    { value: 'Female', label: 'Female' },
                                                    { value: 'Other', label: 'Other' }
                                                ]}
                                                value={{ label: getValues('gender') }}
                                                onChange={value => setValue('gender', value.label)}
                                                size='small'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <InputMask
                                        mask='999-99-9999'
                                        disabled={false}
                                        value={ssN}
                                        style={{ height: '30px' }}
                                        onChange={e => {
                                            setValue('ssn', e.target.value)
                                            setssn(e.target.value)
                                        }}
                                    >
                                        {() => <TextField id='outlined-basic' fullWidth size='small' placeholder='Enter SSN' />}
                                    </InputMask>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        Cell Phone
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        Address
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        Status
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <InputMask
                                        mask='+1 999-999-9999'
                                        disabled={false}
                                        value={cellPhone}
                                        style={{ height: '30px' }}
                                        onChange={e => {
                                            setValue('cellPhone', e.target.value)
                                            setcellPhone(e.target.value)
                                        }}
                                    >
                                        {() => <TextField id='outlined-basic' fullWidth size='small' placeholder='Enter Cell Phone' />}
                                    </InputMask>
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='address'
                                        {...register('address')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                // isClearable
                                                size='small'
                                                placeholder='Enter Address'
                                                {...field}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='status'
                                        margin='dense'
                                        {...register('status')}
                                        control={control}
                                        render={({ field }) => (
                                            <ReactSelect
                                                // isClearable
                                                size='small'
                                                {...field}
                                                options={[
                                                    { value: 'Active', label: 'Active' },
                                                    { value: 'InActive', label: 'InActive' },
                                                    { value: 'Discharge', label: 'Discharge' }
                                                ]}
                                                value={{ label: getValues('status') }}
                                                onChange={value => setValue('status', value.label)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography color='black' variant='caption' fontSize='12px'>
                                        Zip Code
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography color='black' variant='caption' fontSize='12px'>
                                        City
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ fontWeight: 500 }}>
                                    <Typography color='black' variant='caption' fontSize='12px'>
                                        State
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='zipCode'
                                        {...register('zipCode')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                // isClearable
                                                size='small'
                                                placeholder='Please enter zipCode'
                                                {...field}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='city'
                                        {...register('city')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                // isClearable
                                                size='small'
                                                placeholder='Please enter City'
                                                {...field}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Controller
                                        name='state'
                                        {...register('state')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                // isClearable
                                                size='small'
                                                placeholder='Please enter State'
                                                {...field}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ fontWeight: 500 }}>
                                    <Typography component='label' color='black' fontSize='12px'>
                                        Comments
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name='comments'
                                        {...register('comments')}
                                        control={control}
                                        render={({ field }) => (
                                            <TextareaAutosize
                                                // isClearable
                                                aria-label='minimum height'
                                                minRows={5}
                                                placeholder='Enter comments'
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '8px',
                                                    border: '2px solid #black',
                                                    height: '100px', // set a fixed height here
                                                    overflow: 'scroll'
                                                }}
                                                {...field}
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>
                <Grid item xs={12} lg={12} sm={12}>
                    <Button
                        // onClick={handleCancel}
                        variant='gradient'
                        disabled={submitting}
                        style={{
                            marginTop: '0px',
                            marginBottom: '10px',
                            float: 'right',
                            marginLeft: '10px',
                            // marginRight:'-50px',
                            width: '90px',
                            height: '35px',
                            backgroundColor: '#A574FD',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    >
                        <CancelOutlinedIcon
                            fontSize='medium'
                            style={{ color: 'red', paddingRight: '5px' }}
                        ></CancelOutlinedIcon>
                        Cancel
                    </Button>
                    <Button
                        // onClick={handleSubmit(onSubmit)}
                        variant='gradient'
                        disabled={submitting}
                        style={{
                            marginTop: '0px',
                            marginBottom: '10px',
                            float: 'right',
                            marginLeft: 'auto',
                            width: '80px',
                            height: '35px',
                            backgroundColor: '#A574FD',
                            color: 'white',
                            fontSize: '14px'
                        }}
                    >
                        <SaveOutlinedIcon
                            fontSize='medium'
                            style={{
                                color: 'white',
                                paddingRight: '5px',
                                paddingBottom: '2px'
                            }}
                        ></SaveOutlinedIcon>
                        Save
                    </Button>
                </Grid>
            </>
        </Box>
    )
}

export default Demographics
