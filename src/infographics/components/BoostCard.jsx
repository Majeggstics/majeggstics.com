import { createTheme, ThemeProvider, Box, Grid, Paper, Typography } from '@mui/material'
import TokenIcon from './TokenIcon';
import GoldenEggIcon from './GoldenEggIcon';
import { PropTypes } from 'prop-types';
import AllBoosts from '../boosts.json';

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


BoostCard.propTypes = {
    name: PropTypes.string.isRequired,
    boosts: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired,
}

export default function BoostCard({name, boosts, description}) {
    const filteredBoosts = [];
    boosts.forEach((inputBoost) => filteredBoosts.push((AllBoosts.filter((referenceBoost) => referenceBoost.name === inputBoost))[0]));

    const removedDuplicateBoosts = [...new Set(boosts)];

    const removedDuplicateFilteredBoosts = [...new Set(filteredBoosts)];

    const boostCount = boosts.reduce(function(acc,curr){return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc},{});

    var geCost = 0;
    const geCostArray = [];
    filteredBoosts.forEach((inputBoost) => geCostArray.push((inputBoost.geCost)));
    geCost = geCostArray.reduce((partialSum, a) => partialSum + a, 0)

    var tokenCost = 0;
    const tokenCostArray = [];
    filteredBoosts.forEach((inputBoost) => tokenCostArray.push((inputBoost.tokenCost)));
    tokenCost = tokenCostArray.reduce((partialSum, a) => partialSum + a, 0)
    
    return (
         <Grid item xs={12} md={6}>
            <ThemeProvider theme={theme}>
            <Paper elevation={3} sx={{height:"100%"}}>
                <Box paddingY={4} paddingX={7}>
                    <Typography variant="overline" component="h3">
                        {name}
                    </Typography> 
                </Box>
                <Grid container spacing={0} justifyContent="center">
                    {filteredBoosts.map((element,index) => <Grid item key={index}><img src={element.image} width={75}/></Grid>)}
                </Grid>
                <Box textAlign="center">
                    {removedDuplicateBoosts.map((boostName,index) => 
                    <Box key={index}>
                    <Typography variant="h6" component="p">
                        {Object.values(boostCount)[index]}x {boostName} ({removedDuplicateFilteredBoosts[index].duration})
                    </Typography>
                    <Typography variant="body2" component="p">
                        {removedDuplicateFilteredBoosts[index].description}
                    </Typography>
                    </Box>)}
                    </Box>
                <Grid container paddingX={7} paddingTop={4} spacing={3} justifyContent="center" direction="row" alignItems="center">
                    <Grid item>
                        <Typography>
                            Costs:
                        </Typography>
                    </Grid>
                    <Grid item>
                    <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <GoldenEggIcon />
                        <Typography marginLeft={0.5}>
                            {new Intl.NumberFormat().format(geCost)}
                        </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                    <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center"}}>
                            <TokenIcon />
                            <Typography marginLeft={0.5}>
                                {new Intl.NumberFormat().format(tokenCost)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box paddingY={4} paddingX={7}>
                    <Typography align="center">
                        {description}
                    </Typography>
                </Box>
            </Paper>
            </ThemeProvider>
        </Grid> 
    );
}
