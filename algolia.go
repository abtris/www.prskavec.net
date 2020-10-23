package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	search "github.com/algolia/algoliasearch-client-go/v3/algolia/search"
)

type Index struct {
	Authors      []string `json:"authors"`
	Categories   []string `json:"categories"`
	Content      string   `json:"content"`
	Date         int      `json:"date"`
	Publishdate  string   `json:"publishdate"`
	Kind         string   `json:"kind"`
	Lang         string   `json:"lang"`
	ObjectID     string   `json:"objectID"`
	Summary      string   `json:"summary"`
	Tags         []string `json:"tags"`
	Title        string   `json:"title"`
	Section      string   `json:"section"`
	Type         string   `json:"type"`
	Permalink    string   `json:"permalink"`
	Relpermalink string   `json:"relpermalink"`
}

func main() {
	algoliaAppID := os.Getenv("ALGOLIA_APP_ID")
	algoliaAPIKey := os.Getenv("ALGOLIA_API_KEY")
	algoliaIndexName := os.Getenv("ALGOLIA_INDEX_NAME")

	client := search.NewClient(algoliaAppID, algoliaAPIKey)
	index := client.InitIndex(algoliaIndexName)

	var records []Index
	data, _ := ioutil.ReadFile("public/index.json")
	errJSON := json.Unmarshal(data, &records)
	if errJSON != nil {
		fmt.Println(errJSON)
	}
	// MAYBE(abtris): filter by type (get only type=post,talk)?
	_, err := index.SaveObjects(records)
	if err != nil {
		fmt.Println(err)
	} else {
    fmt.Println("Index uploaded.")
  }
}
