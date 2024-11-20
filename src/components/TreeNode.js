import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";

// Styled components
const TreeNodeWrapper = styled.div`
  position: relative;
`;

const DropContainer = styled.div`
  position: relative;
  ${({ isOver, dropPosition }) =>
    isOver &&
    dropPosition === "before" &&
    `
    &:before {
      content: '';
      position: absolute;
      height: 2px;
      background-color: #9f7aea; /* Purple */
      left: 0;
      right: 0;
      top: -1px;
    }
  `}
  ${({ isOver, dropPosition }) =>
    isOver &&
    dropPosition === "after" &&
    `
    &:after {
      content: '';
      position: absolute;
      height: 2px;
      background-color: #9f7aea; /* Purple */
      left: 0;
      right: 0;
      bottom: 0;
    }
  `}
`;

const DragItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 8px;
  opacity: ${({ isDragging }) => (isDragging ? "0.5" : "1")};
  background-color: ${({ isOver, dropPosition }) =>
    isOver && dropPosition === "inside" ? "#f3e8ff" : "transparent"}; /* Light purple */
  padding-left: ${({ level }) => `${level * 24}px`};
  cursor: grab;
`;

const IconWrapper = styled.div`
  cursor: move;
  color: #a0aec0; /* Gray */
`;

const Button = styled.button`
  color: #a0aec0; /* Gray */
  background: none;
  border: none;
  &:hover {
    color: #4a5568; /* Darker gray */
  }
`;

const Tag = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${({ type }) =>
    type === "Landlord"
      ? "#e9d8fd" /* Light purple */
      : type === "Full portfolio"
      ? "#fefcbf" /* Light orange */
      : "#bee3f8"}; /* Light blue */
  color: ${({ type }) =>
    type === "Landlord"
      ? "#6b46c1" /* Purple */
      : type === "Full portfolio"
      ? "#d69e2e" /* Orange */
      : "#3182ce"}; /* Blue */
`;

const Email = styled.span`
  color: #4a5568; /* Gray */
`;

const ActionButtons = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExpandWrapper = styled.div`
  width: 16px;
`;

export const TreeNode = ({
  item,
  level,
  onDrop,
  onToggle,
  parentId,
  index,
}) => {
  const ref = useRef(null);
  const [dropPosition, setDropPosition] = useState("inside");

  const [{ isDragging }, drag] = useDrag({
    type: "TREE_ITEM",
    item: { id: item.id, parentId, index, children: item.children },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "TREE_ITEM",
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (hoverClientY < hoverMiddleY / 2) {
        setDropPosition("before");
      } else if (hoverClientY > (hoverMiddleY * 3) / 2) {
        setDropPosition("after");
      } else {
        setDropPosition("inside");
      }
    },
    drop: (draggedItem) => {
      // Helper function to check if a node is an ancestor of another node
      const isAncestor = (ancestor, descendant) => {
        if (!ancestor.children) return false;
        return ancestor.children.some(
          (child) => child.id === descendant.id || isAncestor(child, descendant)
        );
      };

      // Prevent dropping a parent onto its own child
      if (isAncestor(draggedItem, item)) {
        return;
      }

      // Perform the drop action
      if (draggedItem.id !== item.id) {
        onDrop(draggedItem.id, item.id, dropPosition);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const hasChildren = item.children && item.children.length > 0;

  return (
    <TreeNodeWrapper ref={ref}>
      <DropContainer ref={drop} isOver={isOver} dropPosition={dropPosition}>
        <DragItem
          ref={drag}
          isDragging={isDragging}
          isOver={isOver}
          dropPosition={dropPosition}
          level={level}
        >
          <IconWrapper>
            <GripVertical size={16} />
          </IconWrapper>

          <Tag type={item.type}>{item.type}</Tag>

          <Email>{item.email}</Email>
          {hasChildren ? (
            <Button onClick={() => onToggle(item.id)}>
              {item.isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
          ) : (
            <ExpandWrapper />
          )}
        </DragItem>
      </DropContainer>

      {item.isExpanded && item.children && (
        <div>
          {item.children.map((child, childIndex) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onDrop={onDrop}
              onToggle={onToggle}
              parentId={item.id}
              index={childIndex}
            />
          ))}
        </div>
      )}
    </TreeNodeWrapper>
  );
};
