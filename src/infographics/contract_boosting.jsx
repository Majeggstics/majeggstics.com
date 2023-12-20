import { Container, Grid, Typography, CssBaseline } from "@mui/material";
import BoostCard from "./components/BoostCard";
import DisclaimerBox from "./components/DisclaimerBox";

export default function ContractBoosting() {
    return (
            <Container>
                <CssBaseline />
                <Typography variant="h3" component="h1" textAlign="center" paddingY={5}>
                    Basic Contract Boosting
                </Typography>
                <DisclaimerBox 
                    title="MAJEGGSTICS DISCLAIMER FOR NEW PLAYERS"
                    description="We always recommend that if you are a new player and haven't finished your Epic Research, you should prioritise that above all else (like crafting, stones or boosts). Epic Research gives permanent buffs, making it easier to reach contract, minimum and prestige goals! Check Epic research recommendations for the most efficient path for purchase." 
                    />
                <Grid container spacing={5} marginTop={1}>
                    <BoostCard 
                        name="The Epic"
                        boosts={["Epic Tachyon Prism"]}
                        description="Simple, cheap and efficient. From AA to AAA this will be your bread and butter for GE and Token efficient boosting."
                        />
                    <BoostCard
                        name="The new 4tok"
                        boosts={["Epic Tachyon Prism","Epic Tachyon Prism"]}
                        description="The standard boost combo for AAA contracts. This will most likely bring you above minimums with a baseline of artifacts and Epic Research."
                        />
                </Grid>
            </Container>
    )
}