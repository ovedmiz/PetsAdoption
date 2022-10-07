import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, makeStyles, IconButton } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5),
        minWidth: '500px',
        backgroundColor: '#f9f3e4 '
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: '#EA5C2B',
        color: '#EA5C2B',
        '&:hover': {
            backgroundColor: '#EA5C2B',
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem',
        }
    }
}))

export default function ConfirmDialog(props) {

    const { confirmDialog, setConfirmDialog } = props;
    const classes = useStyles()

    return (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <button onClick={() => {
                    setConfirmDialog({ ...confirmDialog, isOpen: false })
                }} className='appBtn' style={{ backgroundColor: 'lightgray', border: 'none' }}>No</button>
                <button onClick={() => {
                    confirmDialog.onConfirm()
                    setConfirmDialog({ ...confirmDialog, isOpen: false })
                }} className='appBtn' style={{ backgroundColor: 'rgb(255, 94, 0, 0.5)' }} >Yes</button>
            </DialogActions>
        </Dialog>
    )
}