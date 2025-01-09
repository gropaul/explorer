export interface TreeNode<C = TreeNode<any>, T = string> {
    id: string;
    // also serves as unique key
    name: string;
    type: T;
    // is undefined if not loaded, null if no children, otherwise an array of children
    children?: C[] | null;
    payload?: any;
}

export function findNodeInTrees(trees: TreeNode[], id_path: string[]): TreeNode | undefined {

    const artificial_root: TreeNode = {
        id: '',
        name: '',
        type: '',
        children: trees
    }

    return findNode(artificial_root, id_path);
}

export function findNodeParentInTrees(trees: TreeNode[], id_path: string[]): TreeNode | undefined {

    const artifical_root: TreeNode = {
        id: '',
        name: '',
        type: '',
        children: trees
    }

    return findNodeParent(artifical_root, id_path);
}

export function findNodeParent(tree: TreeNode, id_path: string[]): TreeNode | undefined {
    if (id_path.length === 1) {
        return tree;
    }

    const ids_without_last = id_path.slice(0, -1);
    return findNode(tree, ids_without_last);
}

export function findNode(tree: TreeNode, id_path: string[]): TreeNode | undefined {
    if (id_path.length === 0) {
        return tree;
    }

    const [id, ...rest] = id_path;
    const child = tree.children?.find((child) => child.id === id);

    if (child) {
        return findNode(child, rest);
    }

    return undefined;
}