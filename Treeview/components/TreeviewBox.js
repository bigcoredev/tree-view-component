import React, { useEffect, useState } from 'react';
import { DashboardLayoutContainer } from 'components/Layouts/DashboardLayout';
import { Box } from '@mui/material';
import { Typography, Badge, colors, IconGraphy, DatePickerInput } from '@leapeasy/ui-kit';
import { TreeViewer } from './TreeViewer';
import Copyright_icon from '../../../../assets/Treeview/copyright.svg';
import { BackgroundColor } from 'devextreme-react/cjs/chart';

export const TreeviewBox = () => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredCopyright, setHoveredCopyright] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (expanded) {
      setHoveredCopyright(true);
    } else {
      setHoveredCopyright(false);
    }
  }, [expanded]);

  return (
    <DashboardLayoutContainer>
      <Box
        style={{
          position: 'relative',
          width: '380px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif',
          margin: '0 0 15px 0',
          BackgroundColor: '#F8F4F952',
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e0e0e0',
            padding: '14px 16px',
            position: 'relative',
            zIndex: '2',
            ...(expanded ? { background: '#F8F4F9' } : {}),
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Badge
              background="#F3F1F4"
              color="warmBlue"
              label="Landlord"
              textSize="Large"
              rounded
            />
            <Typography variant="body1" style={{ color: colors.neutral[900], fontWeight: '400' }}>
              amtunga@sgf.com
            </Typography>
          </Box>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {expanded && (
              <IconGraphy
                icon="EditorLayout.EditNote"
                width={16}
                height={16}
                style={{
                  color: colors.neutral[200],
                  border: 'solid 1px #e0e0e0',
                  padding: '6px',
                  borderRadius: '5px',
                  background: `${colors.purple[800]}`,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              />
            )}
            {hoveredCopyright ? (
              <IconGraphy
                icon={expanded ? 'Arrow.ExpandLess' : 'Arrow.ExpandMore'}
                width={8}
                height={8}
                style={{
                  color: colors.neutral[900],
                  cursor: 'pointer',
                  border: 'solid 1px #e0e0e0',
                  padding: '10px',
                  borderRadius: '5px',
                  ...(expanded ? { background: '#E8D6EB' } : {}),
                }}
                onClick={toggleExpanded}
                onMouseLeave={() => setHoveredCopyright(expanded || false)}
              />
            ) : (
              <img
                src={Copyright_icon}
                alt="icon"
                onMouseEnter={() => setHoveredCopyright(true)}
                
              />
            )}
          </Box>
        </Box>
        {expanded && (
          <Box>
            <TreeViewer />
          </Box>
        )}
      </Box>
    </DashboardLayoutContainer>
  );
};
