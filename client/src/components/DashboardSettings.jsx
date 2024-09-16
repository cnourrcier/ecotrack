import React from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, Switch, IconButton } from '@mui/material';
import { Settings, ArrowUpward, ArrowDownward } from '@mui/icons-material';

const DashboardSettings = ({ layout, setLayout }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleWidget = (widget) => {
        setLayout(prev =>
            prev.includes(widget)
                ? prev.filter(item => item !== widget)
                : [...prev, widget]
        );
    };

    const moveWidget = (widget, direction) => {
        const index = layout.indexOf(widget);
        if ((direction === 'up' && index > 0) || (direction === 'down' && index < layout.length - 1)) {
            const newLayout = [...layout];
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            [newLayout[index], newLayout[newIndex]] = [newLayout[newIndex], newLayout[index]];
            setLayout(newLayout);
        }
    };

    const allWidgets = ['metrics', 'graph', 'map'];

    return (
        <>
            <Button
                startIcon={<Settings />}
                onClick={handleClick}
                variant="outlined"
                sx={{ mb: 2 }}
            >
                Customize Dashboard
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {allWidgets.map((widget) => (
                    <MenuItem key={widget}>
                        <ListItemIcon>
                            <Switch
                                edge="start"
                                checked={layout.includes(widget)}
                                onChange={() => toggleWidget(widget)}
                                inputProps={{ 'aria-label': `toggle ${widget}` }}
                            />
                        </ListItemIcon>
                        <ListItemText primary={widget.charAt(0).toUpperCase() + widget.slice(1)} />
                        <IconButton
                            size="small"
                            onClick={() => moveWidget(widget, 'up')}
                            disabled={!layout.includes(widget) || layout.indexOf(widget) === 0}
                        >
                            <ArrowUpward fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => moveWidget(widget, 'down')}
                            disabled={!layout.includes(widget) || layout.indexOf(widget) === layout.length - 1}
                        >
                            <ArrowDownward fontSize="small" />
                        </IconButton>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default DashboardSettings;