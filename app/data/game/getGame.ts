
export type GetGameProps = {
  title: string;
  platform: string;
  description: string;
  Last_Update:string;
  tags: string[];
  url: {
    name:string,
    src : string
  }[];
};

export const GetGameData: GetGameProps = {
  title: "Snake",
  platform:"web",
  description:
    `A growing little snake is chasing food in a limited space. 
    With each bite, its body lengthens and its speed gradually increases. 
    Avoiding the walls and its own body, see how long you can last.`,
  Last_Update:"2024-12-05",
  tags: ["Web", "React"],
  url : [
    {
      name : "gameUrl",
      src : "http://localhost:5174/" 
    },
    {
      name : "SourceUrl",
      src : "http://localhost:5174/" 
    },
  ]
};

