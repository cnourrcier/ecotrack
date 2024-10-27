import React, { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemText,
    Switch,
    Slider,
    Typography,
    Box,
} from '@mui/material';
import { Settings } from '@mui/icons-material';

const DashboardSettings = ({ settings, updateSettings }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggle = (setting) => {
        updateSettings({ ...settings, [setting]: !settings[setting] });
    };

    const handleRefreshRateChange = (event, newValue) => {
        updateSettings({ ...settings, refreshRate: newValue });
    };

    return (
        <>
            <Button
                startIcon={<Settings />}
                onClick={handleClick}
                variant='outlined'
                sx={{ mb: 2 }}
            >
                Dashboard Settings
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem>
                    <ListItemText>Use Metric Units</ListItemText>
                    <Switch
                        edge='end'
                        checked={settings.useMetricUnits}
                        onChange={() => handleToggle('useMetricUnits')}
                    />
                </MenuItem>
                <MenuItem>
                    <ListItemText>Show Trends</ListItemText>
                    <Switch
                        edge='end'
                        checked={settings.showTrends}
                        onChange={() => handleToggle('showTrends')}
                    />
                </MenuItem>
                <MenuItem>
                    <Box sx={{ width: 200 }}>
                        <Typography id='refresh-rate-slider' gutterBottom>
                            Refresh Rate: {settings.refreshRate} seconds
                        </Typography>
                        <Slider
                            value={settings.refreshRate}
                            onChange={handleRefreshRateChange}
                            aria-labelledby='refresh-rate-slider'
                            valueLabelDisplay='auto'
                            step={1}
                            marks
                            min={1}
                            max={60}
                        />
                    </Box>
                </MenuItem>
            </Menu>
        </>
    );
};

export default DashboardSettings;
