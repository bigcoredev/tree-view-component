import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TreeNode } from './TreeNode';

const TreeContainer = styled.div`
  max-width: 768px;
  margin: 32px auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0; /* light gray */
`;

const initialData = [
  {
    id: '1',
    email: 'amtunga@sgf.com',
    type: 'Landlord',
    children: [
      {
        id: '2',
        email: 'amtunga@sgf.com',
        type: 'Full portfolio',
      },
      {
        id: '3',
        email: 'amtunga@sgf.com',
        type: 'Full portfolio',
      },
      {
        id: '4',
        email: 'amtunga@sgf.com',
        type: 'Full portfolio',
      },
      {
        id: '5',
        email: 'amtunga@sgf.com',
        type: 'Multi-Site',
        children: [],
      },
      {
        id: '6',
        email: 'amtunga@sgf.com',
        type: 'Multi-Site',
        children: [],
      },
      {
        id: '7',
        email: 'amtunga@sgf.com',
        type: 'Multi-Site',
        children: [],
      },
    ]
  },
  {
    id: '8',
    email: 'amtunga@sgf.com',
    type: 'Landlord',
  }
];

export const TreeView = () => {
  const [treeData, setTreeData] = useState(initialData);

  const findItemById = (items, id) => {
    for (let item of items) {
      if (item.id === id) return [item, items];
      if (item.children) {
        const result = findItemById(item.children, id);
        if (result[0]) return result;
      }
    }
    return [null, null];
  };

  const handleDrop = (draggedId, targetId, position) => {
    if (draggedId === targetId) return;

    const [draggedItem, draggedParent] = findItemById(treeData, draggedId);
    const [targetItem, targetParent] = findItemById(treeData, targetId);

    if (!draggedItem || !draggedParent || !targetItem) return;

    const draggedIndex = draggedParent.indexOf(draggedItem);
    draggedParent.splice(draggedIndex, 1);

    if (position === 'inside') {
      if (!targetItem.children) targetItem.children = [];
      targetItem.children.push(draggedItem);
      targetItem.isExpanded = true;
    } else {
      const targetArray = targetParent || treeData;
      const targetIndex = targetArray.indexOf(targetItem);
      targetArray.splice(position === 'before' ? targetIndex : targetIndex + 1, 0, draggedItem);
    }

    setTreeData([...treeData]);
  };

  const handleToggle = (id) => {
    const [item] = findItemById(treeData, id);
    if (item) {
      item.isExpanded = !item.isExpanded;
      setTreeData([...treeData]);
    }
  };

  useEffect(() => {
    localStorage.setItem('treeData', JSON.stringify(treeData));
  }, [treeData]);

  return (
    <DndProvider backend={HTML5Backend}>
      <TreeContainer>
        {treeData.map((item, index) => (
          <TreeNode
            key={item.id}
            item={item}
            level={0}
            onDrop={handleDrop}
            onToggle={handleToggle}
            parentId={null}
            index={index}
          />
        ))}
      </TreeContainer>
    </DndProvider>
  );
};
