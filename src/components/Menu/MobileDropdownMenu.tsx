import { useState, useRef, useLayoutEffect, useState as useStateReact } from 'react';
import {
    Box,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { ButtonNaked, theme } from '@pagopa/mui-italia';

interface Props {
    selectedIndex: number;
    onItemClick: (index: number) => void;
    items: string[];
}

export const MobileDropdownMenu = ({ selectedIndex, onItemClick, items }: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [menuTop, setMenuTop] = useStateReact(0);
    const headerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (headerRef.current) {
            const rect = headerRef.current.getBoundingClientRect();
            setMenuTop(rect.top);
        }
    }, []);

    const handleClick = (index: number) => {
        onItemClick(index);
        setOpen(false);
    };

    return (
        <>
            <Box
                ref={headerRef}
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    px: 3,
                    pl: 2,
                    py: 1,
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.common.white,
                    borderStyle: "solid",
                    borderBottomWidth: 1,
                    borderBottomColor: theme.palette.divider,
                }}
            >
                <ButtonNaked startIcon={<MenuIcon />} color='text' >
                    <Typography onClick={() => setOpen(!open)} sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                        Menu
                    </Typography>
                </ButtonNaked>
            </Box>
            

            {open && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: `${menuTop}px`,
                        left: 0,
                        right: 0,
                        minHeight: "60vh",
                        zIndex: 1000,
                        bgcolor: theme.palette.background.paper,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} >
                        <IconButton onClick={() => setOpen(false)} sx={{ color: theme.palette.text.primary, mr: 1 }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List component="nav" disablePadding data-testid="menu-list">
                        {items.map((element, i) => (
                            <ListItemButton
                                key={i}
                                selected={selectedIndex === i}
                                onClick={() => handleClick(i)}
                                data-testid={`menu-item-${i}`}
                                sx={{
                                    justifyContent: 'flex-start',
                                    pr: 3,
                                    pl: 6,
                                    py: 1.5,
                                }}
                            >
                                <ListItemText
                                    primary={t(element)}
                                    primaryTypographyProps={{
                                        fontWeight: selectedIndex === i ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            )}
        </>
    );
};