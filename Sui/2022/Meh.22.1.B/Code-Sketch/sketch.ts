import { Leaf, Branch } from "../Meh/model/model";

class Node extends Branch
{
	parts : Array< Node >
}

class Index extends Node
{
	title : Leaf;
}
