export interface BSTNode {
  id: string; // Unique identifier for React rendering
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x: number;
  y: number;
  depth: number;
  height: number;
}

export type NodeState =
  | 'normal'
  | 'comparing'
  | 'traversed'
  | 'found'
  | 'deleted'
  | 'inserted'
  | 'successor'
  | 'candidate'
  | 'highlighted';

export interface TreeStateSnapshot {
  nodesState: { [nodeValue: number]: NodeState };
  activeLines: { [lang: string]: number }; // Active line numbers for code highlight
  explanation: string;
  visitedValues: number[];
  comparisons: number;
  treeStructure: BSTNode | null; // Deep copy of the tree structure at this step
}

export interface TreeStatistics {
  totalNodes: number;
  height: number;
  leafNodes: number;
  levels: number;
  minimum: number | null;
  maximum: number | null;
  averageDepth: number;
  maxDepth: number;
  balancePercentage: number;
  balanceStatus: 'Balanced' | 'Slightly Unbalanced' | 'Highly Unbalanced';
}

// Deep copy helper for tree nodes
export function cloneTree(node: BSTNode | null): BSTNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    x: node.x,
    y: node.y,
    depth: node.depth,
    height: node.height,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

// Generates a random unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Recalculates height and depth of all nodes
export function updateHeightAndDepth(node: BSTNode | null, currentDepth = 0): number {
  if (!node) return -1;
  node.depth = currentDepth;
  const leftH = updateHeightAndDepth(node.left, currentDepth + 1);
  const rightH = updateHeightAndDepth(node.right, currentDepth + 1);
  node.height = Math.max(leftH, rightH) + 1;
  return node.height;
}

// Symmetrical, collision-free Inorder-based BST Layout Solver
export function layoutTree(root: BSTNode | null): void {
  if (!root) return;

  // 1. Reset height and depth metrics
  updateHeightAndDepth(root, 0);

  // 2. Perform Inorder traversal to assign relative ordered ranks
  const inorderList: BSTNode[] = [];
  function traverse(node: BSTNode | null) {
    if (!node) return;
    traverse(node.left);
    inorderList.push(node);
    traverse(node.right);
  }
  traverse(root);

  // 3. Layout nodes using fixed horizontal spacing and vertical levels
  const spacing = 75; // 75px node gap
  inorderList.forEach((node, idx) => {
    node.x = idx * spacing;
    node.y = node.depth * 80 + 40; // 80px level height, starting at 40px
  });

  // 4. Center coordinates around 0 to prevent drifting out of screen bounds
  const minX = inorderList[0].x;
  const maxX = inorderList[inorderList.length - 1].x;
  const midX = (minX + maxX) / 2;

  inorderList.forEach((node) => {
    node.x -= midX;
  });
}

// Convert a tree to a list of values for easy traversal validation
export function getTreeNodesList(node: BSTNode | null): BSTNode[] {
  if (!node) return [];
  return [node, ...getTreeNodesList(node.left), ...getTreeNodesList(node.right)];
}

// Calculate BST statistics
export function calculateStatistics(root: BSTNode | null): TreeStatistics {
  const nodes = getTreeNodesList(root);
  const totalNodes = nodes.length;

  if (totalNodes === 0) {
    return {
      totalNodes: 0,
      height: 0,
      leafNodes: 0,
      levels: 0,
      minimum: null,
      maximum: null,
      averageDepth: 0,
      maxDepth: 0,
      balancePercentage: 100,
      balanceStatus: 'Balanced',
    };
  }

  const height = root ? root.height : 0;
  const leafNodes = nodes.filter((n) => !n.left && !n.right).length;
  const levels = height + 1;
  const values = nodes.map((n) => n.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  const sumDepth = nodes.reduce((sum, n) => sum + n.depth, 0);
  const averageDepth = parseFloat((sumDepth / totalNodes).toFixed(1));
  const maxDepth = Math.max(...nodes.map((n) => n.depth));

  // Compute Balance Meter:
  // Ideal height of a balanced tree is floor(log2(N))
  // A completely skewed tree has height N - 1
  // We can scale the height between ideal and skewed.
  const idealHeight = Math.floor(Math.log2(totalNodes));
  const maxUnbalancedHeight = totalNodes - 1;

  let balancePercentage = 100;
  if (height > idealHeight && maxUnbalancedHeight > idealHeight) {
    const ratio = (height - idealHeight) / (maxUnbalancedHeight - idealHeight);
    balancePercentage = Math.round(100 - ratio * 80); // clamp down to 20%
  } else if (height === idealHeight) {
    balancePercentage = 100;
  }
  // Clamp between 15% and 100%
  balancePercentage = Math.max(15, Math.min(100, balancePercentage));

  let balanceStatus: 'Balanced' | 'Slightly Unbalanced' | 'Highly Unbalanced' = 'Balanced';
  if (balancePercentage < 40) {
    balanceStatus = 'Highly Unbalanced';
  } else if (balancePercentage < 75) {
    balanceStatus = 'Slightly Unbalanced';
  }

  return {
    totalNodes,
    height,
    leafNodes,
    levels,
    minimum,
    maximum,
    averageDepth,
    maxDepth,
    balancePercentage,
    balanceStatus,
  };
}

// -------------------------------------------------------------
// Algorithm Playback Code Line Definitions
// -------------------------------------------------------------
export const CODE_LINES = {
  javascript: {
    insert: [
      `function insert(node, value) {`, // 0
      `  if (!node) return { value, left: null, right: null };`, // 1
      `  if (value < node.value) {`, // 2
      `    node.left = insert(node.left, value);`, // 3
      `  } else if (value > node.value) {`, // 4
      `    node.right = insert(node.right, value);`, // 5
      `  }`, // 6
      `  return node;`, // 7
      `}` // 8
    ],
    search: [
      `function search(node, value) {`, // 0
      `  if (!node || node.value === value) return node;`, // 1
      `  if (value < node.value) {`, // 2
      `    return search(node.left, value);`, // 3
      `  }`, // 4
      `  return search(node.right, value);`, // 5
      `}` // 6
    ],
    delete: [
      `function remove(node, value) {`, // 0
      `  if (!node) return null;`, // 1
      `  if (value < node.value) {`, // 2
      `    node.left = remove(node.left, value);`, // 3
      `  } else if (value > node.value) {`, // 4
      `    node.right = remove(node.right, value);`, // 5
      `  } else {`, // 6 (found node to delete)
      `    if (!node.left && !node.right) return null;`, // 7 (Leaf case)
      `    if (!node.left) return node.right;`, // 8 (One child case)
      `    if (!node.right) return node.left;`, // 9 (One child case)
      `    let temp = findMin(node.right);`, // 10 (Two children case)
      `    node.value = temp.value;`, // 11
      `    node.right = remove(node.right, temp.value);`, // 12
      `  }`, // 13
      `  return node;`, // 14
      `}` // 15
    ],
    traverse: [
      `function traverse(node) {`, // 0
      `  if (!node) return;`, // 1
      `  // Inorder: L -> Root -> R`, // 2
      `  traverse(node.left);`, // 3
      `  visit(node);`, // 4
      `  traverse(node.right);`, // 5
      `}` // 6
    ]
  },
  python: {
    insert: [
      `def insert(node, value):`, // 0
      `    if node is None:`, // 1
      `        return Node(value)`, // 2
      `    if value < node.value:`, // 3
      `        node.left = insert(node.left, value)`, // 4
      `    elif value > node.value:`, // 5
      `        node.right = insert(node.right, value)`, // 6
      `    return node` // 7
    ],
    search: [
      `def search(node, value):`, // 0
      `    if node is None or node.value == value:`, // 1
      `        return node`, // 2
      `    if value < node.value:`, // 3
      `        return search(node.left, value)`, // 4
      `    return search(node.right, value)` // 5
    ],
    delete: [
      `def remove(node, value):`, // 0
      `    if node is None: return None`, // 1
      `    if value < node.value:`, // 2
      `        node.left = remove(node.left, value)`, // 3
      `    elif value > node.value:`, // 4
      `        node.right = remove(node.right, value)`, // 5
      `    else:`, // 6
      `        if not node.left and not node.right:`, // 7
      `            return None`, // 8
      `        if not node.left: return node.right`, // 9
      `        if not node.right: return node.left`, // 10
      `        temp = find_min(node.right)`, // 11
      `        node.value = temp.value`, // 12
      `        node.right = remove(node.right, temp.value)`, // 13
      `    return node` // 14
    ],
    traverse: [
      `def traverse(node):`, // 0
      `    if node is None:`, // 1
      `        return`, // 2
      `    # Inorder traversal`, // 3
      `    traverse(node.left)`, // 4
      `    visit(node)`, // 5
      `    traverse(node.right)` // 6
    ]
  },
  java: {
    insert: [
      `public Node insert(Node node, int value) {`, // 0
      `    if (node == null) return new Node(value);`, // 1
      `    if (value < node.value) {`, // 2
      `        node.left = insert(node.left, value);`, // 3
      `    } else if (value > node.value) {`, // 4
      `        node.right = insert(node.right, value);`, // 5
      `    }`, // 6
      `    return node;`, // 7
      `}` // 8
    ],
    search: [
      `public Node search(Node node, int value) {`, // 0
      `    if (node == null || node.value == value) return node;`, // 1
      `    if (value < node.value) {`, // 2
      `        return search(node.left, value);`, // 3
      `    }`, // 4
      `    return search(node.right, value);`, // 5
      `}` // 6
    ],
    delete: [
      `public Node remove(Node node, int value) {`, // 0
      `    if (node == null) return null;`, // 1
      `    if (value < node.value) {`, // 2
      `        node.left = remove(node.left, value);`, // 3
      `    } else if (value > node.value) {`, // 4
      `        node.right = remove(node.right, value);`, // 5
      `    } else {`, // 6
      `        if (node.left == null && node.right == null) return null;`, // 7
      `        if (node.left == null) return node.right;`, // 8
      `        if (node.right == null) return node.left;`, // 9
      `        Node temp = findMin(node.right);`, // 10
      `        node.value = temp.value;`, // 11
      `        node.right = remove(node.right, temp.value);`, // 12
      `    }`, // 13
      `    return node;`, // 14
      `}` // 15
    ],
    traverse: [
      `void traverse(Node node) {`, // 0
      `    if (node == null) return;`, // 1
      `    // Inorder layout`, // 2
      `    traverse(node.left);`, // 3
      `    visit(node);`, // 4
      `    traverse(node.right);`, // 5
      `}` // 6
    ]
  },
  cpp: {
    insert: [
      `Node* insert(Node* node, int value) {`, // 0
      `    if (node == nullptr) return new Node(value);`, // 1
      `    if (value < node->value) {`, // 2
      `        node->left = insert(node->left, value);`, // 3
      `    } else if (value > node->value) {`, // 4
      `        node->right = insert(node->right, value);`, // 5
      `    }`, // 6
      `    return node;`, // 7
      `}` // 8
    ],
    search: [
      `Node* search(Node* node, int value) {`, // 0
      `    if (node == nullptr || node->value == value) return node;`, // 1
      `    if (value < node->value) {`, // 2
      `        return search(node->left, value);`, // 3
      `    }`, // 4
      `    return search(node->right, value);`, // 5
      `}` // 6
    ],
    delete: [
      `Node* remove(Node* node, int value) {`, // 0
      `    if (node == nullptr) return nullptr;`, // 1
      `    if (value < node->value) {`, // 2
      `        node->left = remove(node->left, value);`, // 3
      `    } else if (value > node->value) {`, // 4
      `        node->right = remove(node->right, value);`, // 5
      `    } else {`, // 6
      `        if (node->left == nullptr && node->right == nullptr) {`, // 7
      `            delete node; return nullptr;`, // 8
      `        }`, // 9
      `        if (node->left == nullptr) {`, // 10
      `            Node* temp = node->right; delete node; return temp;`, // 11
      `        }`, // 12
      `        if (node->right == nullptr) {`, // 13
      `            Node* temp = node->left; delete node; return temp;`, // 14
      `        }`, // 15
      `        Node* temp = findMin(node->right);`, // 16
      `        node->value = temp->value;`, // 17
      `        node->right = remove(node->right, temp->value);`, // 18
      `    }`, // 19
      `    return node;`, // 20
      `}` // 21
    ],
    traverse: [
      `void traverse(Node* node) {`, // 0
      `    if (node == nullptr) return;`, // 1
      `    // Inorder traversal`, // 2
      `    traverse(node->left);`, // 3
      `    visit(node);`, // 4
      `    traverse(node->right);`, // 5
      `}` // 6
    ]
  }
};

// -------------------------------------------------------------
// Algorithm Simulators with Step-by-Step State Recording
// -------------------------------------------------------------

// 1. Search Simulation
export function simulateSearch(root: BSTNode | null, value: number): TreeStateSnapshot[] {
  const steps: TreeStateSnapshot[] = [];
  let comparisons = 0;
  const visitedValues: number[] = [];

  function searchHelper(node: BSTNode | null) {
    if (!node) {
      steps.push({
        nodesState: {},
        activeLines: { javascript: 1, python: 1, java: 1, cpp: 1 },
        explanation: `Reached an empty child (null). Value ${value} does not exist in the BST.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(root),
      });
      return;
    }

    visitedValues.push(node.value);

    const currentNodesState: { [nodeValue: number]: NodeState } = {};
    visitedValues.forEach((val) => {
      currentNodesState[val] = 'traversed';
    });
    currentNodesState[node.value] = 'comparing';

    steps.push({
      nodesState: { ...currentNodesState },
      activeLines: { javascript: 1, python: 1, java: 1, cpp: 1 },
      explanation: `Comparing target value ${value} with current node ${node.value}.`,
      visitedValues: [...visitedValues],
      comparisons,
      treeStructure: cloneTree(root),
    });

    comparisons++;

    if (node.value === value) {
      const finalState = { ...currentNodesState };
      finalState[node.value] = 'found';
      steps.push({
        nodesState: finalState,
        activeLines: { javascript: 1, python: 1, java: 1, cpp: 1 },
        explanation: `Target value ${value} matches current node ${node.value}! Search successful.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(root),
      });
      return;
    }

    if (value < node.value) {
      const leftNodesState = { ...currentNodesState };
      steps.push({
        nodesState: leftNodesState,
        activeLines: { javascript: 3, python: 4, java: 3, cpp: 3 },
        explanation: `Since target value ${value} < ${node.value}, BST search property guides us to the LEFT child.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(root),
      });
      searchHelper(node.left);
    } else {
      const rightNodesState = { ...currentNodesState };
      steps.push({
        nodesState: rightNodesState,
        activeLines: { javascript: 5, python: 5, java: 5, cpp: 5 },
        explanation: `Since target value ${value} > ${node.value}, BST search property guides us to the RIGHT child.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(root),
      });
      searchHelper(node.right);
    }
  }

  steps.push({
    nodesState: {},
    activeLines: { javascript: 0, python: 0, java: 0, cpp: 0 },
    explanation: `Start search for value ${value} from the Root of the tree.`,
    visitedValues: [],
    comparisons: 0,
    treeStructure: cloneTree(root),
  });

  searchHelper(root);
  return steps;
}

// 2. Insert Simulation
export function simulateInsert(root: BSTNode | null, value: number): TreeStateSnapshot[] {
  const steps: TreeStateSnapshot[] = [];
  let comparisons = 0;
  const visitedValues: number[] = [];
  const workingRoot = cloneTree(root);
  layoutTree(workingRoot);

  function insertHelper(node: BSTNode | null, parentValue: number | null, isLeft: boolean): BSTNode {
    if (!node) {
      const newNode: BSTNode = {
        id: generateId(),
        value,
        left: null,
        right: null,
        x: 0,
        y: 0,
        depth: 0,
        height: 0,
      };

      const stepNodesState: { [nodeValue: number]: NodeState } = {};
      visitedValues.forEach((val) => {
        stepNodesState[val] = 'traversed';
      });

      if (parentValue !== null && workingRoot) {
        linkNewNode(workingRoot, parentValue, newNode, isLeft);
      }

      layoutTree(workingRoot || newNode);
      stepNodesState[value] = 'inserted';

      steps.push({
        nodesState: { ...stepNodesState },
        activeLines: { javascript: 1, python: 2, java: 1, cpp: 1 },
        explanation: `Reached a null position. Inserting new node with value ${value} here.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot || newNode),
      });

      return newNode;
    }

    visitedValues.push(node.value);

    const currentNodesState: { [nodeValue: number]: NodeState } = {};
    visitedValues.forEach((val) => {
      currentNodesState[val] = 'traversed';
    });
    currentNodesState[node.value] = 'comparing';

    steps.push({
      nodesState: { ...currentNodesState },
      activeLines: { javascript: 0, python: 0, java: 0, cpp: 0 },
      explanation: `Comparing insert value ${value} with node ${node.value} to determine routing.`,
      visitedValues: [...visitedValues],
      comparisons,
      treeStructure: cloneTree(workingRoot),
    });

    comparisons++;

    if (value === node.value) {
      currentNodesState[node.value] = 'found';
      steps.push({
        nodesState: { ...currentNodesState },
        activeLines: { javascript: 1, python: 1, java: 1, cpp: 1 },
        explanation: `Value ${value} already exists in this BST. Duplicates are not allowed in a standard BST!`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });
      return node;
    }

    if (value < node.value) {
      steps.push({
        nodesState: { ...currentNodesState },
        activeLines: { javascript: 2, python: 3, java: 2, cpp: 2 },
        explanation: `Since ${value} < ${node.value}, routing left to check for insertion spot.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });
      node.left = insertHelper(node.left, node.value, true);
    } else {
      steps.push({
        nodesState: { ...currentNodesState },
        activeLines: { javascript: 4, python: 5, java: 4, cpp: 4 },
        explanation: `Since ${value} > ${node.value}, routing right to check for insertion spot.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });
      node.right = insertHelper(node.right, node.value, false);
    }

    return node;
  }

  function linkNewNode(currNode: BSTNode, pVal: number, nNode: BSTNode, goLeft: boolean): boolean {
    if (currNode.value === pVal) {
      if (goLeft) currNode.left = nNode;
      else currNode.right = nNode;
      return true;
    }
    let found = false;
    if (currNode.left) found = linkNewNode(currNode.left, pVal, nNode, goLeft);
    if (!found && currNode.right) found = linkNewNode(currNode.right, pVal, nNode, goLeft);
    return found;
  }

  steps.push({
    nodesState: {},
    activeLines: { javascript: 0, python: 0, java: 0, cpp: 0 },
    explanation: `Initiating node insertion process for value ${value}. Starting at the root.`,
    visitedValues: [],
    comparisons: 0,
    treeStructure: cloneTree(workingRoot),
  });

  if (!workingRoot) {
    const rootNode: BSTNode = {
      id: generateId(),
      value,
      left: null,
      right: null,
      x: 0,
      y: 40,
      depth: 0,
      height: 0,
    };
    steps.push({
      nodesState: { [value]: 'inserted' },
      activeLines: { javascript: 1, python: 2, java: 1, cpp: 1 },
      explanation: `Tree is empty. Creating new root node with value ${value}.`,
      visitedValues: [],
      comparisons: 0,
      treeStructure: rootNode,
    });
  } else {
    insertHelper(workingRoot, null, false);
  }

  return steps;
}

// 3. Delete Simulation
export function simulateDelete(root: BSTNode | null, value: number): TreeStateSnapshot[] {
  const steps: TreeStateSnapshot[] = [];
  let comparisons = 0;
  const visitedValues: number[] = [];
  const workingRoot = cloneTree(root);
  layoutTree(workingRoot);

  function deleteHelper(
    node: BSTNode | null,
    val: number,
    _parentNode?: BSTNode | null
  ): BSTNode | null {
    if (!node) {
      steps.push({
        nodesState: {},
        activeLines: { javascript: 1, python: 1, java: 1, cpp: 1 },
        explanation: `Node ${val} not found in the BST. Nothing to delete.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });
      return null;
    }

    visitedValues.push(node.value);

    const currentNodesState: { [nodeValue: number]: NodeState } = {};
    visitedValues.forEach((v) => {
      currentNodesState[v] = 'traversed';
    });
    currentNodesState[node.value] = 'comparing';

    steps.push({
      nodesState: { ...currentNodesState },
      activeLines: { javascript: 0, python: 0, java: 0, cpp: 0 },
      explanation: `Looking for node to delete. Comparing ${val} with current node ${node.value}.`,
      visitedValues: [...visitedValues],
      comparisons,
      treeStructure: cloneTree(workingRoot),
    });

    comparisons++;

    if (val < node.value) {
      steps.push({
        nodesState: { ...currentNodesState },
        activeLines: { javascript: 2, python: 2, java: 2, cpp: 2 },
        explanation: `Since ${val} < ${node.value}, the node must be in the LEFT subtree.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });
      node.left = deleteHelper(node.left, val, node);
      layoutTree(workingRoot);
    } else if (val > node.value) {
      steps.push({
        nodesState: { ...currentNodesState },
        activeLines: { javascript: 4, python: 4, java: 4, cpp: 4 },
        explanation: `Since ${val} > ${node.value}, the node must be in the RIGHT subtree.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });
      node.right = deleteHelper(node.right, val, node);
      layoutTree(workingRoot);
    } else {
      currentNodesState[node.value] = 'deleted';

      if (!node.left && !node.right) {
        steps.push({
          nodesState: { ...currentNodesState },
          activeLines: { javascript: 7, python: 7, java: 7, cpp: 7 },
          explanation: `Leaf Node Case: Node ${node.value} has no children. Delete it directly.`,
          visitedValues: [...visitedValues],
          comparisons,
          treeStructure: cloneTree(workingRoot),
        });

        removeRef(workingRoot, node.value);
        layoutTree(workingRoot);

        steps.push({
          nodesState: {},
          activeLines: { javascript: 14, python: 14, java: 14, cpp: 20 },
          explanation: `Node ${node.value} deleted successfully. Recalculating tree layout.`,
          visitedValues: [],
          comparisons,
          treeStructure: cloneTree(workingRoot),
        });
        return null;
      }

      if (!node.left) {
        steps.push({
          nodesState: { ...currentNodesState, [node.right!.value]: 'successor' },
          activeLines: { javascript: 8, python: 9, java: 8, cpp: 10 },
          explanation: `One Child Case: Node ${node.value} has only a right child (${node.right!.value}). Bypass ${node.value} and link parent to this child.`,
          visitedValues: [...visitedValues],
          comparisons,
          treeStructure: cloneTree(workingRoot),
        });

        bypassRef(workingRoot, node.value, node.right);
        layoutTree(workingRoot);

        steps.push({
          nodesState: {},
          activeLines: { javascript: 14, python: 14, java: 14, cpp: 20 },
          explanation: `Bypassed node ${node.value}. Tree restructured.`,
          visitedValues: [],
          comparisons,
          treeStructure: cloneTree(workingRoot),
        });
        return node.right;
      }

      if (!node.right) {
        steps.push({
          nodesState: { ...currentNodesState, [node.left!.value]: 'successor' },
          activeLines: { javascript: 9, python: 10, java: 9, cpp: 13 },
          explanation: `One Child Case: Node ${node.value} has only a left child (${node.left!.value}). Bypass ${node.value} and link parent to this child.`,
          visitedValues: [...visitedValues],
          comparisons,
          treeStructure: cloneTree(workingRoot),
        });

        bypassRef(workingRoot, node.value, node.left);
        layoutTree(workingRoot);

        steps.push({
          nodesState: {},
          activeLines: { javascript: 14, python: 14, java: 14, cpp: 20 },
          explanation: `Bypassed node ${node.value}. Tree restructured.`,
          visitedValues: [],
          comparisons,
          treeStructure: cloneTree(workingRoot),
        });
        return node.left;
      }

      steps.push({
        nodesState: { ...currentNodesState },
        activeLines: { javascript: 10, python: 11, java: 10, cpp: 16 },
        explanation: `Two Children Case: Node ${node.value} has left and right children. We must find its inorder successor (smallest value in its right subtree).`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });

      let succ = node.right!;
      const successorPath: number[] = [node.value, succ.value];
      const succStates: { [nodeValue: number]: NodeState } = {
        ...currentNodesState,
        [node.value]: 'deleted',
        [succ.value]: 'candidate',
      };

      steps.push({
        nodesState: { ...succStates },
        activeLines: { javascript: 10, python: 11, java: 10, cpp: 16 },
        explanation: `Go to right child ${succ.value}, then trace down left.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });

      while (succ.left) {
        succ = succ.left;
        successorPath.push(succ.value);
        succStates[succ.value] = 'candidate';

        steps.push({
          nodesState: { ...succStates },
          activeLines: { javascript: 10, python: 11, java: 10, cpp: 16 },
          explanation: `Move left to ${succ.value} looking for inorder successor.`,
          visitedValues: [...visitedValues],
          comparisons,
          treeStructure: cloneTree(workingRoot),
        });
      }

      succStates[succ.value] = 'successor';
      steps.push({
        nodesState: { ...succStates },
        activeLines: { javascript: 10, python: 11, java: 10, cpp: 16 },
        explanation: `Inorder successor found: node ${succ.value}. It has no left child by definition.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });

      const originalValue = node.value;
      const successorValue = succ.value;
      node.value = successorValue;

      swapValueRef(workingRoot, originalValue, successorValue);

      const swappedStates: { [nodeValue: number]: NodeState } = {};
      swappedStates[successorValue] = 'highlighted';
      swappedStates[succ.value] = 'deleted';

      steps.push({
        nodesState: { ...swappedStates },
        activeLines: { javascript: 11, python: 12, java: 11, cpp: 17 },
        explanation: `Copy successor value (${successorValue}) to original node. Now, recursively delete successor node (${successorValue}) from right subtree.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(workingRoot),
      });

      node.right = deleteHelper(node.right, successorValue, node);
      layoutTree(workingRoot);
    }
    return node;
  }

  function removeRef(curr: BSTNode | null, val: number): boolean {
    if (!curr) return false;
    if (curr.left && curr.left.value === val) {
      curr.left = null;
      return true;
    }
    if (curr.right && curr.right.value === val) {
      curr.right = null;
      return true;
    }
    return removeRef(curr.left, val) || removeRef(curr.right, val);
  }

  function bypassRef(curr: BSTNode | null, val: number, child: BSTNode | null): boolean {
    if (!curr) return false;
    if (curr.left && curr.left.value === val) {
      curr.left = child;
      return true;
    }
    if (curr.right && curr.right.value === val) {
      curr.right = child;
      return true;
    }
    if (curr.value === val) {
      if (workingRoot) {
        workingRoot.value = child!.value;
        workingRoot.left = child!.left;
        workingRoot.right = child!.right;
      }
      return true;
    }
    return bypassRef(curr.left, val, child) || bypassRef(curr.right, val, child);
  }

  function swapValueRef(curr: BSTNode | null, oldVal: number, newVal: number): boolean {
    if (!curr) return false;
    if (curr.value === oldVal) {
      curr.value = newVal;
      return true;
    }
    return swapValueRef(curr.left, oldVal, newVal) || swapValueRef(curr.right, oldVal, newVal);
  }

  steps.push({
    nodesState: {},
    activeLines: { javascript: 0, python: 0, java: 0, cpp: 0 },
    explanation: `Initiating deletion workflow for node ${value}.`,
    visitedValues: [],
    comparisons: 0,
    treeStructure: cloneTree(workingRoot),
  });

  if (!workingRoot) {
    steps.push({
      nodesState: {},
      activeLines: { javascript: 1, python: 1, java: 1, cpp: 1 },
      explanation: `Tree is empty. Deletion cannot proceed.`,
      visitedValues: [],
      comparisons: 0,
      treeStructure: null,
    });
  } else {
    if (workingRoot.value === value && !workingRoot.left && !workingRoot.right) {
      steps.push({
        nodesState: { [value]: 'deleted' },
        activeLines: { javascript: 7, python: 8, java: 7, cpp: 7 },
        explanation: `Root node ${value} is a leaf node. Deleting root node.`,
        visitedValues: [],
        comparisons: 1,
        treeStructure: cloneTree(workingRoot),
      });
      steps.push({
        nodesState: {},
        activeLines: { javascript: 14, python: 14, java: 14, cpp: 20 },
        explanation: `Tree is now empty.`,
        visitedValues: [],
        comparisons: 1,
        treeStructure: null,
      });
    } else {
      deleteHelper(workingRoot, value, null);
    }
  }

  return steps;
}

// 4. Traversals Simulation
export function simulateTraversal(
  root: BSTNode | null,
  mode: 'inorder' | 'preorder' | 'postorder' | 'levelorder'
): TreeStateSnapshot[] {
  const steps: TreeStateSnapshot[] = [];
  const visitedValues: number[] = [];

  if (!root) {
    steps.push({
      nodesState: {},
      activeLines: { javascript: 1, python: 1, java: 1, cpp: 1 },
      explanation: `Tree is empty. Traversal returns empty sequence.`,
      visitedValues: [],
      comparisons: 0,
      treeStructure: null,
    });
    return steps;
  }

  steps.push({
    nodesState: {},
    activeLines: { javascript: 0, python: 0, java: 0, cpp: 0 },
    explanation: `Initializing ${mode.toUpperCase()} traversal.`,
    visitedValues: [],
    comparisons: 0,
    treeStructure: cloneTree(root),
  });

  if (mode === 'levelorder') {
    const queue: BSTNode[] = [root];
    const comparisons = 0;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      visitedValues.push(curr.value);

      const activeState: { [nodeValue: number]: NodeState } = {};
      visitedValues.forEach((v) => {
        activeState[v] = 'traversed';
      });
      activeState[curr.value] = 'found';

      steps.push({
        nodesState: { ...activeState },
        activeLines: { javascript: 4, python: 5, java: 4, cpp: 4 },
        explanation: `Visit node ${curr.value}. Add it to traversal sequence. Queue remaining children.`,
        visitedValues: [...visitedValues],
        comparisons,
        treeStructure: cloneTree(root),
      });

      if (curr.left) {
        queue.push(curr.left);
      }
      if (curr.right) {
        queue.push(curr.right);
      }
    }
  } else {
    function dfs(node: BSTNode | null) {
      if (!node) return;

      const codeLinesHighlight = {
        inorder: { left: 3, visit: 4, right: 5 },
        preorder: { visit: 2, left: 3, right: 4 },
        postorder: { left: 2, right: 3, visit: 4 },
      };

      const h = codeLinesHighlight[mode as 'inorder' | 'preorder' | 'postorder'];

      if (mode === 'preorder') {
        visitedValues.push(node.value);
        const activeState: { [nodeValue: number]: NodeState } = {};
        visitedValues.forEach((v) => {
          activeState[v] = 'traversed';
        });
        activeState[node.value] = 'found';

        steps.push({
          nodesState: { ...activeState },
          activeLines: { javascript: h.visit, python: h.visit, java: h.visit, cpp: h.visit },
          explanation: `Preorder: Visit Node ${node.value} (Root of subtree) first.`,
          visitedValues: [...visitedValues],
          comparisons: 0,
          treeStructure: cloneTree(root),
        });
      }

      if (node.left) {
        const activeState: { [nodeValue: number]: NodeState } = {};
        visitedValues.forEach((v) => {
          activeState[v] = 'traversed';
        });
        activeState[node.value] = 'comparing';
        activeState[node.left.value] = 'comparing';

        steps.push({
          nodesState: { ...activeState },
          activeLines: { javascript: h.left, python: h.left, java: h.left, cpp: h.left },
          explanation: `Recursive call: Traverse Left subtree of node ${node.value}.`,
          visitedValues: [...visitedValues],
          comparisons: 0,
          treeStructure: cloneTree(root),
        });
        dfs(node.left);
      }

      if (mode === 'inorder') {
        visitedValues.push(node.value);
        const activeState: { [nodeValue: number]: NodeState } = {};
        visitedValues.forEach((v) => {
          activeState[v] = 'traversed';
        });
        activeState[node.value] = 'found';

        steps.push({
          nodesState: { ...activeState },
          activeLines: { javascript: h.visit, python: h.visit, java: h.visit, cpp: h.visit },
          explanation: `Inorder: Visit Node ${node.value}. Notice how Inorder Traversal outputs values in sorted ascending order!`,
          visitedValues: [...visitedValues],
          comparisons: 0,
          treeStructure: cloneTree(root),
        });
      }

      if (node.right) {
        const activeState: { [nodeValue: number]: NodeState } = {};
        visitedValues.forEach((v) => {
          activeState[v] = 'traversed';
        });
        activeState[node.value] = 'comparing';
        activeState[node.right.value] = 'comparing';

        steps.push({
          nodesState: { ...activeState },
          activeLines: { javascript: h.right, python: h.right, java: h.right, cpp: h.right },
          explanation: `Recursive call: Traverse Right subtree of node ${node.value}.`,
          visitedValues: [...visitedValues],
          comparisons: 0,
          treeStructure: cloneTree(root),
        });
        dfs(node.right);
      }

      if (mode === 'postorder') {
        visitedValues.push(node.value);
        const activeState: { [nodeValue: number]: NodeState } = {};
        visitedValues.forEach((v) => {
          activeState[v] = 'traversed';
        });
        activeState[node.value] = 'found';

        steps.push({
          nodesState: { ...activeState },
          activeLines: { javascript: h.visit, python: h.visit, java: h.visit, cpp: h.visit },
          explanation: `Postorder: Visit Node ${node.value} (Root of subtree) after left and right subtrees have been fully traversed.`,
          visitedValues: [...visitedValues],
          comparisons: 0,
          treeStructure: cloneTree(root),
        });
      }
    }

    dfs(root);
  }

  const finalState: { [nodeValue: number]: NodeState } = {};
  visitedValues.forEach((v) => {
    finalState[v] = 'found';
  });
  steps.push({
    nodesState: finalState,
    activeLines: { javascript: 6, python: 6, java: 6, cpp: 6 },
    explanation: `${mode.toUpperCase()} Traversal complete. Output: [${visitedValues.join(', ')}].`,
    visitedValues: [...visitedValues],
    comparisons: 0,
    treeStructure: cloneTree(root),
  });

  return steps;
}

// Generate Balanced BST from sorted array of values
export function buildBalancedBST(values: number[]): BSTNode | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);

  function sortedArrayToBST(start: number, end: number, depth: number): BSTNode | null {
    if (start > end) return null;
    const mid = Math.floor((start + end) / 2);
    const node: BSTNode = {
      id: generateId(),
      value: sorted[mid],
      left: sortedArrayToBST(start, mid - 1, depth + 1),
      right: sortedArrayToBST(mid + 1, end, depth + 1),
      x: 0,
      y: 0,
      depth,
      height: 0,
    };
    return node;
  }

  const root = sortedArrayToBST(0, sorted.length - 1, 0);
  layoutTree(root);
  return root;
}
