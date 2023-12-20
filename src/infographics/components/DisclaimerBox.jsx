import { createTheme, ThemeProvider, Box, Paper, Typography } from '@mui/material'
import { PropTypes } from 'prop-types';

const theme = createTheme({
    components: {
        MuiTypography: {
            variants: [
                {
                    props: {
                        variant: "overline"
                    },
                    style: {
                        fontSize: 20,
                    }
                }
            ]
        }
    }
})

export default function DisclaimerBox({title, description}) {
    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={3}>
                <Box paddingY={4} paddingX={7}>
                <Typography variant="overline" component="p">
                    {title}
                </Typography>
                <Typography variant="body1" component="p">
                    {description}
                </Typography>
                </Box>
            </Paper>
        </ThemeProvider>
    );
}

DisclaimerBox.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
    
}